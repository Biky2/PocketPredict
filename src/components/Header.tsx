'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, Percent, Coins, ArrowRight } from 'lucide-react';

export function Header() {
  const pathname = usePathname();

  const navLinks = [
    {
      href: '/emi',
      label: 'Loan Affordability',
      icon: <Coins className="w-4 h-4 mr-1.5" />,
      tag: 'Approval odds'
    },
    {
      href: '/debt',
      label: 'Debt Payoff Compare',
      icon: <Percent className="w-4 h-4 mr-1.5" />,
      tag: 'Snowball vs Avalanche'
    },
    {
      href: '/savings',
      label: 'Savings Projector',
      icon: <TrendingUp className="w-4 h-4 mr-1.5" />,
      tag: 'HYSA scenarios'
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group space-x-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:border-emerald-500/40 transition-colors">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  PocketPredict
                </span>
                <span className="text-[10px] text-muted-foreground -mt-1 tracking-wide font-medium">
                  FINANCE CALCULATORS
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-emerald-400 bg-emerald-500/5 border border-emerald-500/10'
                      : 'text-muted-foreground hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  {link.icon}
                  {link.label}
                  {link.tag && !isActive && (
                    <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 text-[8px] font-semibold text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                      {link.tag}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Value Quick Badge */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center px-3 py-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full font-medium">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
              Free & Unrestricted
            </div>
            <Link
              href="/debt"
              className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10"
            >
              Quick Test
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
        
        {/* Navigation Mobile Tab Bar */}
        <div className="flex md:hidden border-t border-border/40 py-2 justify-around">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-md text-[10px] font-medium transition-all ${
                  isActive ? 'text-emerald-400 bg-emerald-500/5' : 'text-muted-foreground hover:text-white'
                }`}
              >
                {React.cloneElement(link.icon, { className: 'w-4 h-4 mb-0.5' })}
                <span>{link.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
