import Link from 'next/link';
import { AuthorBio } from '@/components/AuthorBio';
import { Coins, Percent, TrendingUp, ArrowRight, ShieldCheck, Zap, UserCheck } from 'lucide-react';

export const metadata = {
  title: 'PocketPredict Finance - Smart, Prediction-Enhanced Finance Calculators',
  description: 'Free, smarter-than-average personal finance calculators. Loan approval estimation for freelancers, snowball vs avalanche comparisons, and high-yield savings growth simulations. Zero signups.',
  keywords: [
    'personal finance',
    'loan affordability',
    'debt payoff strategy',
    'savings projection',
    'budget planning',
    'freelancer tools'
  ],
};

export default function Home() {
  const tools = [
    {
      id: 'emi',
      href: '/emi',
      title: 'Loan & EMI Affordability Calculator',
      description: 'Go beyond basic EMI formulas. Calculate your Debt-to-Income (DTI) ratio to estimate your realistic approval odds from underwriting guidelines.',
      features: ['Freelancer/Contractor friendly', 'Back-end DTI assessment', 'Actionable down-payment targets'],
      icon: <Coins className="w-8 h-8 text-emerald-400" />,
      colorClass: 'border-emerald-500/20 hover:border-emerald-500/40 bg-emerald-500/[0.01]'
    },
    {
      id: 'debt',
      href: '/debt',
      title: 'Smart Debt Payoff Compare',
      description: 'Input your debts and compare Snowball (lowest balance first) vs. Avalanche (highest rate first) side-by-side. See which strategy gets you debt-free faster.',
      features: ['Simulates payoff month-by-month', 'Interactive balance timelines', 'Shows interest money saved'],
      icon: <Percent className="w-8 h-8 text-amber-400" />,
      colorClass: 'border-amber-500/20 hover:border-amber-500/40 bg-amber-500/[0.01]'
    },
    {
      id: 'savings',
      href: '/savings',
      title: 'Savings & Growth Projector',
      description: 'Project how compounding high-yield savings (HYSA) rates scale your emergency fund. Run "what-if" scenarios to shave months off your goals.',
      features: ['Compound interest tracking', 'Scenario comparison curves', 'Goal timeline calculations'],
      icon: <TrendingUp className="w-8 h-8 text-sky-400" />,
      colorClass: 'border-sky-500/20 hover:border-sky-500/40 bg-sky-500/[0.01]'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-16 animate-slide-up">
      {/* Hero Headline */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
          <Zap className="w-3.5 h-3.5 mr-1" />
          No Login. No Email Wall. Just Instant Projections.
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Smarter math for your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">real financial planning</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">
          Standard calculators just spit out standard formulas. PocketPredict runs underwriting assessments and scenario comparisons to show how banks view your profile and how actions alter your timeline.
        </p>
      </section>

      {/* Grid of calculators */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((t) => (
          <div
            key={t.id}
            className={`glass-card p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between hover:translate-y-[-2px] ${t.colorClass}`}
          >
            <div className="space-y-4">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-border/40 inline-block">
                {t.icon}
              </div>
              <h3 className="text-xl font-bold text-white leading-tight">
                {t.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                {t.description}
              </p>
              
              <ul className="space-y-2 pt-2">
                {t.features.map((f, i) => (
                  <li key={i} className="flex items-center text-xs text-slate-300 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/80 mr-2 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6">
              <Link
                href={t.href}
                className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700/80 text-white border border-border/60 hover:border-slate-500 transition-all"
              >
                Launch Calculator
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 text-emerald-400" />
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Trust Rules and Stats Banner */}
      <section className="bg-slate-900/40 rounded-2xl border border-border/60 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="space-y-2 md:col-span-2">
          <h3 className="text-lg font-bold text-white flex items-center">
            <UserCheck className="w-5 h-5 text-emerald-400 mr-2" />
            Transparent & Clean Code Policies
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            This app is designed for trust: no persistent profiles, no tracking cookies, no database storage, and no hidden data collection. Every calculation is performed in memory and cleared immediately.
          </p>
        </div>
        <div className="bg-slate-950/60 p-4 rounded-xl border border-border/60 flex flex-col justify-center items-center text-center">
          <span className="text-3xl font-extrabold text-white tracking-tight">100%</span>
          <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider mt-1">Private & Secure</span>
          <span className="text-[10px] text-muted-foreground mt-1">Inputs are never saved</span>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="bg-slate-950/40 rounded-2xl border border-border/60 p-6 sm:p-8">
        <h3 className="text-lg font-bold text-white">Important Disclaimer</h3>
        <p className="mt-3 text-sm text-slate-400 leading-relaxed">
          PocketPredict is provided for informational purposes only and is not financial advice. Use this tool as a guide, not a guarantee.
        </p>
        <p className="mt-3 text-sm text-slate-400 leading-relaxed">
          I am not responsible for any financial decisions, losses, or outcomes that result from using this application.
        </p>
        <p className="mt-3 text-sm text-slate-400 leading-relaxed">
          No personal data is stored, and this app does not keep any user inputs after processing the request.
        </p>
      </section>

      {/* Author Biography Section */}
      <section className="pt-8 border-t border-border/40">
        <AuthorBio />
      </section>
    </div>
  );
}
