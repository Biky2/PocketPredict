'use client';

import React, { useEffect, useRef, useState } from 'react';

interface TurnstileProps {
  onVerify: (token: string) => void;
  className?: string;
}

declare global {
  interface Window {
    onloadTurnstileCallback?: () => void;
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export function Turnstile({ onVerify, className = '' }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  // Public testing key provided by Cloudflare: always passes
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';
  const isDevMode = !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (isDevMode) {
      // Automatically verify in dev mode without injecting the captcha script
      onVerify('mock-dev-token');
      return;
    }

    // 1. Inject script if not loaded
    const scriptId = 'cloudflare-turnstile-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    const checkLoaded = () => {
      if (window.turnstile) {
        setScriptLoaded(true);
      } else {
        setTimeout(checkLoaded, 100);
      }
    };

    checkLoaded();

    return () => {
      // Clean up widget on unmount
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [isDevMode, onVerify]);

  useEffect(() => {
    if (!scriptLoaded || !containerRef.current || !window.turnstile || isDevMode) return;

    try {
      // Render Turnstile
      const id = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: 'dark',
        callback: (token: string) => {
          onVerify(token);
        },
        'error-callback': () => {
          console.error('Turnstile widget encountered an error');
        },
        'expired-callback': () => {
          onVerify('');
          if (widgetIdRef.current && window.turnstile) {
            window.turnstile.reset(widgetIdRef.current);
          }
        }
      });
      widgetIdRef.current = id;
    } catch (err) {
      console.error('Failed to render Turnstile widget:', err);
    }
  }, [scriptLoaded, siteKey, onVerify, isDevMode]);

  if (isDevMode) {
    return (
      <div className="text-[11px] text-emerald-500/60 font-medium py-1 px-2.5 rounded bg-emerald-500/5 border border-emerald-500/10 inline-block">
        🛡️ Turnstile Bypassed (Dev Mode)
      </div>
    );
  }

  return (
    <div className={`flex justify-center my-3 ${className}`}>
      <div ref={containerRef} />
    </div>
  );
}
