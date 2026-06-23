'use client';

import React from 'react';
import { CALCULATORS } from '@/data/calculators';
import { CalculatorLayout } from '@/components/CalculatorLayout';
import { CheckCircle, AlertCircle } from 'lucide-react';

export function EmiCalculator() {
  const calculator = CALCULATORS.find((c) => c.id === 'emi-affordability')!;

  const renderResults = (result: any) => {
    const { 
      emi, 
      totalInterest, 
      totalPayment, 
      dti, 
      housingDti, 
      approvalRating, 
      approvalOddsRange, 
      ratingColor, 
      analysis, 
      suggestions 
    } = result;

    const getBadgeStyle = () => {
      switch (ratingColor) {
        case 'emerald':
          return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        case 'teal':
          return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
        case 'amber':
          return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
        case 'orange':
          return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
        case 'rose':
          return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        default:
          return 'bg-slate-800 text-slate-300 border-border';
      }
    };

    const getProgressStyle = () => {
      switch (ratingColor) {
        case 'emerald':
        case 'teal':
          return 'bg-emerald-500';
        case 'amber':
          return 'bg-amber-500';
        case 'orange':
          return 'bg-orange-500';
        case 'rose':
          return 'bg-rose-500';
        default:
          return 'bg-slate-500';
      }
    };

    return (
      <div className="space-y-6">
        {/* Core summary card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-950/60 rounded-xl border border-border/60">
            <span className="text-xs text-slate-400 font-medium block">Monthly EMI Cost</span>
            <span className="text-3xl font-extrabold text-white block mt-1">
              ${emi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5 block">Estimated payments at given term & rate</span>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-border/60 flex flex-col justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium block">Approval Likelihood</span>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold border ${getBadgeStyle()}`}>
                  {approvalRating}
                </span>
                <span className="text-sm font-semibold text-slate-300">({approvalOddsRange})</span>
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground block mt-2">DTI Underwriting standards check</span>
          </div>
        </div>

        {/* DTI Gauge Bar */}
        <div className="p-5 bg-slate-950/40 border border-border/60 rounded-xl space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Debt-to-Income (DTI) Ratio</span>
            <span className="font-bold text-white text-sm">{dti}%</span>
          </div>
          
          <div className="w-full bg-slate-900 rounded-full h-3.5 border border-border/40 overflow-hidden relative">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getProgressStyle()}`} 
              style={{ width: `${Math.min(100, dti)}%` }} 
            />
            {/* Limit Markers */}
            <div className="absolute top-0 bottom-0 left-[36%] w-0.5 bg-slate-950" title="Safe Limit 36%" />
            <div className="absolute top-0 bottom-0 left-[43%] w-0.5 bg-slate-950" title="Critical Limit 43%" />
          </div>

          <div className="flex justify-between text-[9px] text-slate-500 px-0.5">
            <span>0% (Debt Free)</span>
            <span className="text-emerald-400">36% (Conforming Limit)</span>
            <span className="text-amber-500">43% (Standard Max)</span>
            <span>100%</span>
          </div>
        </div>

        {/* Deep Analysis Explanation */}
        <div className="p-4 bg-slate-950/60 border border-border/40 rounded-xl space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center">
            {dti < 43 ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 mr-1.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 mr-1.5" />
            )}
            Likelihood Breakdown
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {analysis}
          </p>
        </div>

        {/* Suggestion & Planning Section */}
        <div className="p-4 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-xl space-y-3">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Optimized Target Guidelines
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 block">Target Safe DTI Limit (36%):</span>
              <strong className="text-white">${suggestions.targetDtiMonthlyLimit}/mo total debt</strong>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 block">Recommended Monthly Housing Budget:</span>
              <strong className="text-white">${suggestions.safeEmiBudget}/mo</strong>
            </div>
          </div>
        </div>

        {/* Standard Loan Details */}
        <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/20 p-3 rounded-lg border border-border/30">
          <div>
            <span className="text-slate-500">Total Interest Paid:</span>
            <p className="font-semibold text-slate-300">${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div>
            <span className="text-slate-500">Total Borrowing Cost:</span>
            <p className="font-semibold text-slate-300">${totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
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
