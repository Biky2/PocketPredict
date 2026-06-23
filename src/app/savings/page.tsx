import type { Metadata } from 'next';
import { SavingsCalculator } from './SavingsCalculator';

export const metadata: Metadata = {
  title: 'Savings Growth Projector - Custom Financial Timeline Planner',
  description:
    'Calculate compound savings progress with custom APY rates and review side-by-side growth comparisons showing what happens if you increase monthly savings.',
  alternates: {
    canonical: '/savings',
  },
  openGraph: {
    title: 'Self-Employed Savings & Growth Projector',
    description:
      'Project your savings growth curve with High-Yield Savings Accounts (HYSA) and run scenarios to speed up your target timelines.',
    url: '/savings',
  },
};

export default function SavingsPage() {
  return <SavingsCalculator />;
}
