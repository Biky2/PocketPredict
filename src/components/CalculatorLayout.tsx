'use client';

import React, { useState, useEffect, startTransition } from 'react';
import { CALCULATORS, CalculatorDefinition, Debt } from '@/data/calculators';
import { Turnstile } from './Turnstile';
import { AuthorBio } from './AuthorBio';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  RefreshCw, 
  Share2, 
  Info, 
  CheckCircle2, 
  AlertTriangle,
  Plus,
  Trash2
} from 'lucide-react';

interface CalculatorLayoutProps {
  calculator: CalculatorDefinition;
  renderResults: (result: any) => React.ReactNode;
}

export function CalculatorLayout({ calculator, renderResults }: CalculatorLayoutProps) {
  // Setup default state from calculator schema definitions
  const [fields, setFields] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    calculator.fields.forEach((f) => {
      initial[f.name] = f.defaultValue;
    });
    return initial;
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Auto-calculate on initial load if we have valid fields to give immediate value
  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculator.id]);

  const handleFieldChange = (name: string, value: any) => {
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleDebtChange = (index: number, key: keyof Debt, value: any) => {
    const updatedDebts = [...(fields.debts || [])];
    updatedDebts[index] = {
      ...updatedDebts[index],
      [key]: key === 'name' ? value : Number(value) || 0
    };
    handleFieldChange('debts', updatedDebts);
  };

  const addDebtRow = () => {
    const currentDebts = fields.debts || [];
    const newDebt: Debt = {
      id: Math.random().toString(),
      name: `Debt #${currentDebts.length + 1}`,
      balance: 1000,
      interestRate: 10,
      minPayment: 30
    };
    handleFieldChange('debts', [...currentDebts, newDebt]);
  };

  const removeDebtRow = (index: number) => {
    const currentDebts = fields.debts || [];
    if (currentDebts.length <= 1) {
      setError('You need to maintain at least one debt item to calculate.');
      return;
    }
    const updated = currentDebts.filter((_: any, i: number) => i !== index);
    handleFieldChange('debts', updated);
  };

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calculatorId: calculator.id,
          fields,
          turnstileToken
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'An error occurred while computing projections.');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // Fallback
    }
  };

  const hasAdvancedFields = calculator.fields.some((f) => f.advanced);
  const regularFields = calculator.fields.filter((f) => !f.advanced && f.type !== 'debts');
  const advancedFields = calculator.fields.filter((f) => f.advanced && f.type !== 'debts');
  const debtField = calculator.fields.find((f) => f.type === 'debts');

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 animate-slide-up">
      {/* Intro section leading straight to tool */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {calculator.title}
        </h1>
        <p className="mt-3 text-lg text-slate-400 max-w-3xl">
          {calculator.tagline}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form container */}
        <form 
          onSubmit={handleCalculate}
          className="lg:col-span-5 bg-slate-900/60 border border-border/80 rounded-2xl p-6 shadow-xl space-y-6"
        >
          <div className="border-b border-border/40 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              Calculator Inputs
            </h3>
            <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Immediate Estimates
            </span>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-lg text-xs flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Regular fields */}
          <div className="space-y-4">
            {regularFields.map((field) => (
              <div key={field.name} className="flex flex-col space-y-1.5 relative">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center">
                    {field.label}
                    {field.tooltip && (
                      <button
                        type="button"
                        onClick={() => setActiveTooltip(activeTooltip === field.name ? null : field.name)}
                        className="ml-1 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </label>
                </div>

                {activeTooltip === field.name && field.tooltip && (
                  <div className="p-3 bg-slate-950 border border-border text-xs text-slate-300 rounded-lg animate-slide-up mb-2">
                    {field.tooltip}
                  </div>
                )}

                <div className="relative rounded-lg shadow-sm">
                  {field.prefix && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 text-sm">
                      {field.prefix}
                    </div>
                  )}
                  <input
                    type="number"
                    step={field.step || 1}
                    min={field.min ?? 0}
                    max={field.max}
                    value={fields[field.name]}
                    onChange={(e) => handleFieldChange(field.name, Number(e.target.value))}
                    className={`block w-full rounded-lg bg-slate-950/60 border border-border py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                      field.prefix ? 'pl-8' : 'px-3.5'
                    } ${field.suffix ? 'pr-10' : ''}`}
                  />
                  {field.suffix && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 text-sm">
                      {field.suffix}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Special Debts input table */}
            {debtField && (
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    {debtField.label}
                  </label>
                  <button
                    type="button"
                    onClick={addDebtRow}
                    className="inline-flex items-center text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Debt Item
                  </button>
                </div>

                <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                  {(fields.debts || []).map((debt: Debt, index: number) => (
                    <div 
                      key={debt.id} 
                      className="p-3 bg-slate-950/40 border border-border/60 rounded-xl space-y-2 relative"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={debt.name}
                          placeholder="Debt Name"
                          onChange={(e) => handleDebtChange(index, 'name', e.target.value)}
                          className="w-full bg-transparent border-0 border-b border-border/40 pb-1 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => removeDebtRow(index)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                          title="Delete debt row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[11px]">
                        <div>
                          <label className="text-slate-500 block mb-0.5">Balance</label>
                          <div className="relative">
                            <span className="absolute left-1.5 top-1.5 text-slate-600 text-[10px]">$</span>
                            <input
                              type="number"
                              value={debt.balance}
                              onChange={(e) => handleDebtChange(index, 'balance', e.target.value)}
                              className="w-full rounded bg-slate-950 border border-border/60 py-1 pl-4 pr-1 text-white focus:outline-none focus:border-emerald-500 text-xs"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-slate-500 block mb-0.5">Rate (APY)</label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.1"
                              value={debt.interestRate}
                              onChange={(e) => handleDebtChange(index, 'interestRate', e.target.value)}
                              className="w-full rounded bg-slate-950 border border-border/60 py-1 px-1.5 text-white focus:outline-none focus:border-emerald-500 text-xs"
                            />
                            <span className="absolute right-1.5 top-1.5 text-slate-600 text-[10px]">%</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-slate-500 block mb-0.5">Min Pay</label>
                          <div className="relative">
                            <span className="absolute left-1.5 top-1.5 text-slate-600 text-[10px]">$</span>
                            <input
                              type="number"
                              value={debt.minPayment}
                              onChange={(e) => handleDebtChange(index, 'minPayment', e.target.value)}
                              className="w-full rounded bg-slate-950 border border-border/60 py-1 pl-4 pr-1 text-white focus:outline-none focus:border-emerald-500 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Advanced fields toggler */}
          {hasAdvancedFields && (
            <div className="pt-2 border-t border-border/40">
              <button
                type="button"
                onClick={() => {
                  startTransition(() => {
                    setShowAdvanced((prev) => !prev);
                  });
                }}
                className="flex items-center text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                {showAdvanced ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5 mr-1" />
                    Hide Advanced Options
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5 mr-1" />
                    Show Advanced Options ({advancedFields.length})
                  </>
                )}
              </button>

              {showAdvanced && (
                <div className="mt-4 space-y-4 animate-slide-up">
                  {advancedFields.map((field) => (
                    <div key={field.name} className="flex flex-col space-y-1.5 relative">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-300 flex items-center">
                          {field.label}
                          {field.tooltip && (
                            <button
                              type="button"
                              onClick={() => setActiveTooltip(activeTooltip === field.name ? null : field.name)}
                              className="ml-1 text-slate-500 hover:text-slate-300 transition-colors"
                            >
                              <HelpCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </label>
                      </div>

                      {activeTooltip === field.name && field.tooltip && (
                        <div className="p-3 bg-slate-950 border border-border text-xs text-slate-300 rounded-lg animate-slide-up mb-2">
                          {field.tooltip}
                        </div>
                      )}

                      <div className="relative rounded-lg shadow-sm">
                        {field.prefix && (
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 text-sm">
                            {field.prefix}
                          </div>
                        )}
                        <input
                          type="number"
                          step={field.step || 1}
                          min={field.min ?? 0}
                          max={field.max}
                          value={fields[field.name]}
                          onChange={(e) => handleFieldChange(field.name, Number(e.target.value))}
                          className={`block w-full rounded-lg bg-slate-950/60 border border-border py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                            field.prefix ? 'pl-8' : 'px-3.5'
                          } ${field.suffix ? 'pr-10' : ''}`}
                        />
                        {field.suffix && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 text-sm">
                            {field.suffix}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Turnstile block */}
          <Turnstile onVerify={(token) => setTurnstileToken(token)} />

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Calculating Scenarios...
              </>
            ) : (
              'Calculate Projection & Estimate'
            )}
          </button>
        </form>

        {/* Results container */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="bg-slate-900/40 border border-border/50 rounded-2xl p-6 shadow-xl space-y-6 animate-slide-up">
              {/* Result header utilities */}
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Your Smart Projections</h3>
                  <p className="text-xs text-slate-400">Based on algorithmic credit/math simulations</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-border/40 text-slate-300 hover:text-white transition-colors"
                    title="Copy link to page"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCalculate}
                    className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-border/40 text-slate-300 hover:text-white transition-colors"
                    title="Recalculate values"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {copied && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg text-center font-medium animate-slide-up">
                  Page link copied to clipboard! Share it with others.
                </div>
              )}

              {/* Specific result cards rendering */}
              {renderResults(result)}

              {/* Small ethical disclaimer */}
              <div className="text-[11px] leading-relaxed text-muted-foreground p-3.5 bg-slate-950/60 rounded-xl border border-border/40 flex items-start space-x-2">
                <Info className="w-4 h-4 text-emerald-500/60 mt-0.5 flex-shrink-0" />
                <span>{calculator.disclaimer}</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/20 border border-dashed border-border rounded-2xl py-24 px-6 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-slate-800/60 flex items-center justify-center mb-4 text-slate-500">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-300">Ready to compute</h3>
              <p className="mt-1.5 text-sm text-slate-500 max-w-sm">
                Enter your details on the left and hit calculate to generate your likelihood assessment and timelines.
              </p>
            </div>
          )}

          {/* Author bio on side/bottom */}
          <AuthorBio />
        </div>
      </div>

      {/* Methodology Section below the fold */}
      <section className="mt-16 pt-12 border-t border-border/40">
        <div className="max-w-4xl">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Methodology & Financial Underwriting Standards</span>
          </h2>
          <div className="mt-4 text-sm leading-relaxed text-slate-400 space-y-4">
            <p>{calculator.methodology}</p>
            <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
              <h4 className="font-semibold text-emerald-400 text-xs uppercase tracking-wider mb-1">
                Transparency Statement
              </h4>
              <p className="text-xs text-slate-300">
                {calculator.aboutText}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
