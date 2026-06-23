import type { Metadata } from 'next';
import { EmiCalculator } from './EmiCalculator';

export const metadata: Metadata = {
  title: 'Freelancer Loan & EMI Affordability Calculator - Estimate Bank Approval',
  description:
    'Estimate your loan affordability and get a realistic bank approval likelihood as a freelancer or self-employed contractor. Calculate DTI limits and approval odds.',
  alternates: {
    canonical: '/emi',
  },
  openGraph: {
    title: 'Loan & EMI Affordability Calculator for Freelancers',
    description:
      'Go beyond basic EMI math. Estimate your Debt-to-Income ratio and mortgage approval odds with freelancer-specific underwriting rules.',
    url: '/emi',
  },
};

export default function EmiPage() {
  return <EmiCalculator />;
}
