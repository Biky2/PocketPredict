'use client';

import React from 'react';
import { CALCULATORS } from '@/data/calculators';
import { CalculatorLayout } from '@/components/CalculatorLayout';
import { SvgChart } from '@/components/SvgChart';
import { Award, Zap, Calendar, TrendingDown, DollarSign } from 'lucide-react';

export function DebtCalculator() {
  const calculator = CALCULATORS.find((c) => c.id === 'debt-payoff')!;

  const renderResults = (result: any) => {
    const {
      avalanche,
      snowball,
      interestSaved,
      timeDifferenceMonths,
    } = result;

    if (!avalanche || !snowball) return null;

    const chartSeries = [
      {
        id: 'avalanche',
        name: 'Avalanche (Highest Rate First)',
        color: '#10B981',
        data: avalanche.history.map((h: any) => ({ x: h.month, y: h.totalBalance }))
      },
      {
        id: 'snowball',
        name: 'Snowball (Lowest Balance First)',
        color: '#F59E0B',
        data: snowball.history.map((h: any) => ({ x: h.month, y: h.totalBalance }))
      }
    ];

    const getRecommendationDetails = () => {
      if (interestSaved > 0) {
        return {
          title: 'Avalanche is Cheaper & Faster',
          text: `By prioritizing the highest interest rate debts first, you will save $${interestSaved.toLocaleString()} in interest charges and become debt-free ${timeDifferenceMonths} month(s) sooner compared to the Snowball strategy.`,
          icon: <Award className="w-5 h-5 text-emerald-400 mr-2" />
        };
      } else if (interestSaved === 0 && timeDifferenceMonths === 0) {
        return {
          title: 'Strategies Yield Identical Timelines',
          text: 'Because your debts or payment margins result in identical payoff schedules, either method works! Pick Snowball for quick psychological wins or Avalanche for technical precision.',
          icon: <Zap className="w-5 h-5 text-teal-400 mr-2" />
        };
      } else {
        return {
          title: 'Snowball Outperforms in this Case',
          text: `In this specific scenario, Snowball results in saving $${Math.abs(interestSaved).toLocaleString()} and clears your debts quicker.`,
          icon: <Award className="w-5 h-5 text-amber-400 mr-2" />
        };
      }
    };

    const rec = getRecommendationDetails();

    return (
      <div className="space-y-6">
        <div className="p-4 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-xl flex items-start">
          {rec.icon}
          <div>
            <h4 className="text-sm font-bold text-white leading-none mb-1">
              {rec.title}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {rec.text}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.01] space-y-3 relative">
            <span className="absolute top-3 right-3 text-[9px] font-bold tracking-wider text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
              Cheapest Option
            </span>
            <h4 className="text-sm font-bold text-emerald-400 flex items-center">
              Avalanche Strategy
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block">Time to Debt-Free</span>
                <strong className="text-base text-white flex items-center mt-0.5">
                  <Calendar className="w-4 h-4 text-slate-400 mr-1" />
                  {avalanche.months} Months
                </strong>
                <span className="text-[10px] text-muted-foreground">({Math.round(avalanche.months / 12 * 10) / 10} years)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Total Interest Paid</span>
                <strong className="text-base text-white flex items-center mt-0.5">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  {avalanche.totalInterestPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </strong>
                <span className="text-[10px] text-muted-foreground">in lifetime payments</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/10 bg-amber-500/[0.01] space-y-3 relative">
            <span className="absolute top-3 right-3 text-[9px] font-bold tracking-wider text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase">
              Psychological wins
            </span>
            <h4 className="text-sm font-bold text-amber-400 flex items-center">
              Snowball Strategy
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block">Time to Debt-Free</span>
                <strong className="text-base text-white flex items-center mt-0.5">
                  <Calendar className="w-4 h-4 text-slate-400 mr-1" />
                  {snowball.months} Months
                </strong>
                <span className="text-[10px] text-muted-foreground">({Math.round(snowball.months / 12 * 10) / 10} years)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Total Interest Paid</span>
                <strong className="text-base text-white flex items-center mt-0.5">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  {snowball.totalInterestPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </strong>
                <span className="text-[10px] text-muted-foreground">in lifetime payments</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center">
            <TrendingDown className="w-4 h-4 text-emerald-400 mr-1.5" />
            Total Remaining Balance Over Time
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
