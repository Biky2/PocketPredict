'use client';

import React, { useMemo, useState, useRef } from 'react';

interface DataPoint {
  x: number; // Month
  y: number; // Value (Balance, Savings, etc.)
}

interface ChartSeries {
  id: string;
  name: string;
  color: string; // Tailwind hex color
  data: DataPoint[];
}

interface SvgChartProps {
  series: ChartSeries[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  formatY?: (val: number) => string;
}

export function SvgChart({
  series,
  xAxisLabel = 'Months',
  yAxisLabel = 'Amount',
  formatY = (val) => `$${val.toLocaleString()}`
}: SvgChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pad coordinates for labels and axes
  const paddingLeft = 70;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 40;

  const width = 600;
  const height = 300;

  // Compute overall bounds
  const { minX, maxX, minY, maxY } = useMemo(() => {
    let minX = 0;
    let maxX = 1;
    let minY = 0;
    let maxY = 1000;

    const allPoints = series.flatMap((s) => s.data);
    if (allPoints.length > 0) {
      const xs = allPoints.map((p) => p.x);
      const ys = allPoints.map((p) => p.y);
      minX = Math.min(...xs);
      maxX = Math.max(...xs);
      minY = Math.min(0, ...ys); // Force y-axis to start at at least 0
      maxY = Math.max(...ys) * 1.1; // Add 10% buffer at top
    }

    return { minX, maxX, minY, maxY };
  }, [series]);

  // Coordinate conversion helpers
  const getX = (xValue: number) => {
    const range = maxX - minX || 1;
    const ratio = (xValue - minX) / range;
    return paddingLeft + ratio * (width - paddingLeft - paddingRight);
  };

  const getY = (yValue: number) => {
    const range = maxY - minY || 1;
    const ratio = (yValue - minY) / range;
    return height - paddingBottom - ratio * (height - paddingTop - paddingBottom);
  };

  // Build grid lines
  const gridLines = useMemo(() => {
    const lines = [];
    const ticksCount = 5;
    for (let i = 0; i < ticksCount; i++) {
      const ratio = i / (ticksCount - 1);
      const yValue = minY + ratio * (maxY - minY);
      const yPos = getY(yValue);
      lines.push({
        yPos,
        yValue
      });
    }
    return lines;
  }, [minY, maxY]);

  const xGridTicks = useMemo(() => {
    if (series.length === 0 || series[0].data.length === 0) return [];
    const dataPoints = series[0].data;
    const step = Math.max(1, Math.floor(dataPoints.length / 6));
    const ticks = [];
    for (let i = 0; i < dataPoints.length; i += step) {
      ticks.push(dataPoints[i].x);
    }
    // Always include the last month
    if (dataPoints.length > 0 && !ticks.includes(dataPoints[dataPoints.length - 1].x)) {
      ticks.push(dataPoints[dataPoints.length - 1].x);
    }
    return ticks;
  }, [series]);

  // Generate SVG path code for the series lines and gradient areas
  const chartPaths = useMemo(() => {
    return series.map((s) => {
      if (s.data.length === 0) return { linePath: '', areaPath: '', ...s };

      const points = s.data.map((p) => ({
        px: getX(p.x),
        py: getY(p.y)
      }));

      // Line path
      let linePath = `M ${points[0].px} ${points[0].py}`;
      for (let i = 1; i < points.length; i++) {
        linePath += ` L ${points[i].px} ${points[i].py}`;
      }

      // Area path (closed loop back to y = 0 axis line)
      const zeroY = getY(0);
      const firstX = points[0].px;
      const lastX = points[points.length - 1].px;
      const areaPath = `${linePath} L ${lastX} ${zeroY} L ${firstX} ${zeroY} Z`;

      return {
        ...s,
        linePath,
        areaPath
      };
    });
  }, [series, minX, maxX, minY, maxY]);

  // Handle interaction overlay metrics
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (series.length === 0 || series[0].data.length === 0) return;
    const svgRect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - svgRect.left;
    
    // Translate clientX to relative coordinates
    const scaleX = width / svgRect.width;
    const relativeX = clientX * scaleX;

    // Find closest index in dataset
    const dataPoints = series[0].data;
    let closestIndex = 0;
    let minDistance = Infinity;

    dataPoints.forEach((p, idx) => {
      const px = getX(p.x);
      const distance = Math.abs(px - relativeX);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    setHoverIndex(closestIndex);
  };

  const activePoints = useMemo(() => {
    if (hoverIndex === null || series.length === 0) return [];
    return series.map((s) => {
      const pt = s.data[hoverIndex] || s.data[s.data.length - 1];
      return {
        seriesName: s.name,
        color: s.color,
        x: pt.x,
        y: pt.y,
        px: getX(pt.x),
        py: getY(pt.y)
      };
    });
  }, [hoverIndex, series]);

  return (
    <div className="w-full flex flex-col" ref={containerRef}>
      {/* Chart container */}
      <div className="relative w-full bg-slate-950/40 rounded-xl p-4 border border-border/60">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Definitions for area gradients */}
          <defs>
            {series.map((s) => (
              <linearGradient key={s.id} id={`grad-${s.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.15" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0.0" />
              </linearGradient>
            ))}
          </defs>

          {/* Grid lines */}
          {gridLines.map((line, idx) => (
            <g key={idx}>
              <line
                x1={paddingLeft}
                y1={line.yPos}
                x2={width - paddingRight}
                y2={line.yPos}
                stroke="#1E293B"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <text
                x={paddingLeft - 8}
                y={line.yPos + 4}
                fill="#64748B"
                fontSize="10"
                textAnchor="end"
                className="font-medium"
              >
                {formatY(line.yValue)}
              </text>
            </g>
          ))}

          {/* X Axis ticks */}
          {xGridTicks.map((xVal, idx) => {
            const xPos = getX(xVal);
            return (
              <g key={idx}>
                <line
                  x1={xPos}
                  y1={height - paddingBottom}
                  x2={xPos}
                  y2={height - paddingBottom + 5}
                  stroke="#334155"
                  strokeWidth="1"
                />
                <text
                  x={xPos}
                  y={height - paddingBottom + 18}
                  fill="#64748B"
                  fontSize="10"
                  textAnchor="middle"
                  className="font-medium"
                >
                  Mo {xVal}
                </text>
              </g>
            );
          })}

          {/* Axes */}
          <line
            x1={paddingLeft}
            y1={height - paddingBottom}
            x2={width - paddingRight}
            y2={height - paddingBottom}
            stroke="#334155"
            strokeWidth="1.5"
          />
          <line
            x1={paddingLeft}
            y1={paddingTop}
            x2={paddingLeft}
            y2={height - paddingBottom}
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* Paths for gradients */}
          {chartPaths.map((s) => (
            <path
              key={`area-${s.id}`}
              d={s.areaPath}
              fill={`url(#grad-${s.id})`}
            />
          ))}

          {/* Paths for lines */}
          {chartPaths.map((s) => (
            <path
              key={`line-${s.id}`}
              d={s.linePath}
              fill="none"
              stroke={s.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Interactive cursor line */}
          {hoverIndex !== null && activePoints.length > 0 && (
            <line
              x1={activePoints[0].px}
              y1={paddingTop}
              x2={activePoints[0].px}
              y2={height - paddingBottom}
              stroke="#475569"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          )}

          {/* Indicator dots for hover points */}
          {hoverIndex !== null &&
            activePoints.map((pt, idx) => (
              <circle
                key={idx}
                cx={pt.px}
                cy={pt.py}
                r="5"
                fill={pt.color}
                stroke="#020617"
                strokeWidth="2"
              />
            ))}
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-4 pt-3 border-t border-border/40 text-xs">
          {series.map((s) => (
            <div key={s.id} className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-slate-300 font-medium">{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating active point indicator values */}
      {hoverIndex !== null && activePoints.length > 0 && (
        <div className="mt-3 p-3 bg-slate-900/90 rounded-lg border border-border/60 text-xs flex flex-wrap items-center justify-between gap-4">
          <div className="text-slate-400">
            Timeline Point:{' '}
            <strong className="text-white">Month {activePoints[0].x}</strong> ({Math.round(activePoints[0].x / 12 * 10) / 10} yrs)
          </div>
          <div className="flex flex-wrap gap-4">
            {activePoints.map((pt, idx) => (
              <div key={idx} className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pt.color }} />
                <span className="text-slate-400">{pt.seriesName}:</span>
                <span className="font-semibold text-white">{formatY(pt.y)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
