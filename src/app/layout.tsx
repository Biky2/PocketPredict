import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import Script from 'next/script';
import { Header } from '@/components/Header';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'PocketPredict Finance - Smart calculators with underwriting projections',
    template: '%s | PocketPredict'
  },
  description: 'Free, prediction-enhanced calculators for freelancers and creators. Run Loan Affordability (DTI check), Debt payoff comparisons, and APY compounding savings plans. No login.',
  keywords: [
    'finance calculator',
    'EMI calculator',
    'debt payoff',
    'savings projector',
    'DTI calculator',
    'freelancer finance',
    'personal finance tool'
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://pocketpredict.com'),
  alternates: {
    canonical: '/'
  },
  authors: [{
    name: 'Biky Deo',
    url: 'https://www.linkedin.com/in/dev-biky'
  }],
  publisher: 'PocketPredict',
  openGraph: {
    title: 'PocketPredict Finance - Smart Financial Planning Calculators',
    description: 'Free, prediction-enhanced calculators for freelancers. Run DTI loan checks, compare snowball vs avalanche payoff, and project compounding emergency savings.',
    url: 'https://pocketpredict.com',
    siteName: 'PocketPredict',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://pocketpredict.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PocketPredict finance calculators'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PocketPredict Finance - Smart Calculators',
    description: 'Estimate loan approval odds and optimize debt payoff paths with zero signup barriers.',
    images: ['https://pocketpredict.com/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  // JSON-LD structured data for Google Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    'name': 'PocketPredict Smart Finance Calculators',
    'description': 'Free personal finance calculators featuring Debt-to-Income (DTI) mortgage approval simulations, Snowball vs. Avalanche payoff timelines, and HYSA compound growth projections.',
    'url': 'https://pocketpredict.com',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'provider': {
      '@type': 'Organization',
      'name': 'PocketPredict',
      'url': 'https://pocketpredict.com'
    }
  };

  return (
    <html lang="en" className={`${outfit.variable} h-full dark`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-emerald-500/20 selection:text-emerald-300">
        {/* GA4 Script Integration */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        <Header />
        
        <main className="flex-1 w-full bg-slate-950/20">
          {children}
        </main>

        <footer className="border-t border-border bg-slate-950 py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div>
              <span>© {new Date().getFullYear()} PocketPredict Finance. All rights reserved.</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Note</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
