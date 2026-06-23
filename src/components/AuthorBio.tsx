import React from 'react';
import { Mail, ExternalLink, Heart, GitBranch } from 'lucide-react';

export function AuthorBio() {
  return (
    <div className="w-full glass-card p-6 rounded-xl border border-border bg-slate-900/20">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* Profile Avatar Graphics */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/10">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-bold text-lg text-emerald-400">
              BD
            </div>
          </div>
          <span className="absolute bottom-0 right-0 block h-4.5 w-4.5 rounded-full bg-emerald-500 border-2 border-slate-950" title="Online" />
        </div>

        {/* Story details */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
            <h4 className="text-base font-semibold text-white">Biky Deo</h4>
            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Developer & Indie Builder
            </span>
          </div>
          
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            I built <strong className="text-slate-200">PocketPredict</strong> because I was tired of generic finance tools that treat independent careers like corporate cubicle jobs. When I went freelance, standard mortgage calculators couldn&apos;t tell me if a bank would reject my variable income, and payoff charts didn&apos;t show snowball vs. avalanche strategies side-by-side. 
          </p>
          
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            I wrote these tools to run the actual underwriting simulation math and return direct answers. No signup requirements, no annoying newsletter gates, and no hard sells. Just honest projections.
          </p>

          {/* Social details */}
          <div className="mt-4 pt-4 border-t border-border/40 flex flex-wrap items-center justify-center sm:justify-between gap-3 text-xs">
            <div className="flex items-center text-muted-foreground">
              <Heart className="w-3.5 h-3.5 text-rose-500 mr-1 animate-pulse" />
              <span>Created with care in 2026</span>
            </div>
            
            <div className="flex items-center space-x-3 text-muted-foreground">
              <a
                href="https://www.linkedin.com/in/dev-biky"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center"
              >
                <Mail className="w-3.5 h-3.5 mr-1" />
                <span>LinkedIn</span>
              </a>
              <span>•</span>
              <a
                href="https://github.com/Biky2/PocketPredict.git"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center"
              >
                <GitBranch className="w-3.5 h-3.5 mr-1" />
                <span>Open Source</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
