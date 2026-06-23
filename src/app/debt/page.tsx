import type { Metadata } from 'next';
import { DebtCalculator } from './DebtCalculator';

export const metadata: Metadata = {
  title: 'Debt Payoff Planner - Compare Snowball & Avalanche Payoff Timelines',
  description:
    'Input multiple debts to compare the Debt Snowball and Debt Avalanche payment strategies side-by-side. Get a monthly payment schedule and interest savings projection.',
  alternates: {
    canonical: '/debt',
  },
  openGraph: {
    title: 'Smart Debt Payoff Planner (Snowball vs. Avalanche)',
    description:
      'Compare payoff strategies, create an optimal payment timeline, and see exactly when you will be debt-free.',
    url: '/debt',
  },
};

export default function DebtPage() {
  return <DebtCalculator />;
}
