'use client';

import React from 'react';
import { CALCULATORS } from '@/data/calculators';
import { CalculatorLayout } from '@/components/CalculatorLayout';
import { SvgChart } from '@/components/SvgChart';
import { Compass, Flame, ShieldCheck } from 'lucide-react';

export function SavingsCalculator() {
  const calculator = CALCULATORS.find((c) => c.id === 'savings-projector')!;

  const renderResults = (result: any) => {
    const {
      baseline,
      scenarioPlus100,
      scenarioPlus250,
      goalReached,
      apy
    } = result;

    if (!baseline) return null;

    const chartSeries = [
      {
        id: 'baseline',
        name: 'Baseline Plan',
        color: '#10B981',
        data: baseline.history.map((h: any) => ({ x: h.month, y: h.balance }))
      },
      {
        id: 'plus100',
        name: 'Save $100 More/mo',
        color: '#0D9488',
        data: scenarioPlus100.history.map((h: any) => ({ x: h.month, y: h.balance }))
      },
      {
        id: 'plus250',
        name: 'Save $250 More/mo',
        color: '#0284C7',
        data: scenarioPlus250.history.map((h: any) => ({ x: h.month, y: h.balance }))
      }
    ];

    const diff100 = baseline.months - scenarioPlus100.months;
    const diff250 = baseline.months - scenarioPlus250.months;

    return (
      <div className="space-y-6">
        {goalReached ? (
          <div className="p-4 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-xl flex items-start">
            <Compass className="w-5 h-5 text-emerald-400 mr-2.5 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white leading-none mb-1">
                Your Savings Growth Projection
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                At your baseline rate, you will reach your goal in <strong className="text-white">{baseline.months} month(s)</strong> (about {Math.round(baseline.months / 12 * 10) / 10} years), earning a total of <strong className="text-white">${baseline.totalInterestEarned.toLocaleString()}</strong> in interest with a {apy}% APY savings yield.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-amber-500/[0.03] border border-amber-500/10 rounded-xl flex items-start">
            <Compass className="w-5 h-5 text-amber-400 mr-2.5 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white leading-none mb-1">
                Extended Projection
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Based on your current parameters, it will take longer than 30 years to hit your savings goal. Consider increasing your monthly contributions or exploring HYSAs with higher APYs.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center">
            <Flame className="w-4 h-4 text-emerald-400 mr-1.5" />
            Acceleration Scenarios
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-teal-500/10 bg-teal-500/[0.01] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                  +$100 / Month
                </span>
                {diff100 > 0 && (
                  <span className="text-xs font-semibold text-emerald-400">
                    Shaves off {diff100} months
                  </span>
                )}
              </div>
              <div className="text-xs">
                <span className="text-slate-500 block">Goal Reached In</span>
                <strong className="text-lg text-white block mt-0.5">{scenarioPlus100.months} Months</strong>
                <span className="text-[10px] text-muted-foreground">Total Interest: ${scenarioPlus100.totalInterestEarned.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-sky-500/10 bg-sky-500/[0.01] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  +$250 / Month
                </span>
                {diff250 > 0 && (
                  <span className="text-xs font-semibold text-emerald-400">
                    Shaves off {diff250} months
                  </span>
                )}
              </div>
              <div className="text-xs">
                <span className="text-slate-500 block">Goal Reached In</span>
                <strong className="text-lg text-white block mt-0.5">{scenarioPlus250.months} Months</strong>
                <span className="text-[10px] text-muted-foreground">Total Interest: ${scenarioPlus250.totalInterestEarned.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mr-1.5" />
            Compounding Growth Curve Comparison
          </h4>
          <SvgChart 
            series={chartSeries} 
            xAxisLabel="Months" 
            yAxisLabel="Balance"
          />
        </div>
      </div>
    );
  };

  return (
    <CalculatorLayout
      calculator={calculator}
      renderResults={renderResults}
    />
  );
}
