export interface FieldDefinition {
  name: string;
  label: string;
  type: 'number' | 'text' | 'select' | 'debts';
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  tooltip?: string;
  advanced?: boolean;
}

export interface CalculatorDefinition {
  id: string;
  title: string;
  shortName: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  fields: FieldDefinition[];
  disclaimer: string;
  methodology: string;
  aboutText: string;
}

export const CALCULATORS: CalculatorDefinition[] = [
  {
    id: 'emi-affordability',
    title: 'Loan & EMI Affordability Calculator for Freelancers',
    shortName: 'Loan Affordability',
    tagline: 'See how much home you can realistically afford—and get your likely bank approval range based on gig-income underwriting standard guidelines.',
    seoTitle: 'Freelancer Loan & EMI Affordability Calculator - Estimate Bank Approval',
    seoDescription: 'Estimate your loan affordability and get a realistic bank approval likelihood as a freelancer or self-employed contractor. Calculate DTI limits and options.',
    fields: [
      {
        name: 'grossIncome',
        label: 'Average Monthly Gross Income',
        type: 'number',
        defaultValue: 6500,
        min: 0,
        prefix: '$',
        tooltip: 'For freelancers, lenders usually average the last 24 months of tax return net profits. Use that monthly average here.'
      },
      {
        name: 'existingDebt',
        label: 'Existing Monthly Debt Payments',
        type: 'number',
        defaultValue: 600,
        min: 0,
        prefix: '$',
        tooltip: 'Minimum payments on credit cards, student loans, auto loans, or existing mortgages.'
      },
      {
        name: 'loanAmount',
        label: 'Requested Loan Amount',
        type: 'number',
        defaultValue: 350000,
        min: 1000,
        prefix: '$',
        tooltip: 'The total amount you want to borrow.'
      },
      {
        name: 'downPayment',
        label: 'Down Payment Saved',
        type: 'number',
        defaultValue: 70000,
        min: 0,
        prefix: '$',
        advanced: true
      },
      {
        name: 'interestRate',
        label: 'Annual Interest Rate',
        type: 'number',
        defaultValue: 6.8,
        min: 0.1,
        max: 30,
        step: 0.05,
        suffix: '%',
        advanced: true
      },
      {
        name: 'loanTenure',
        label: 'Loan Tenure (Years)',
        type: 'number',
        defaultValue: 30,
        min: 1,
        max: 50,
        suffix: 'yrs',
        advanced: true
      }
    ],
    disclaimer: 'Disclaimer: This tool calculates estimate ranges based on Debt-to-Income (DTI) underwriting guidelines. Lenders use additional variables, including credit scores, tax history consistency, and reserve assets. This is not a financial offer or a formal loan guarantee.',
    methodology: 'Our model computes standard loan principal repayments and adds your monthly debt obligations. Lenders divide total monthly recurring debt by your gross income to get the Debt-to-Income (DTI) ratio. Conforming lending guidelines typically target a front-end DTI under 28-31% (just the housing payment) and a back-end DTI under 36-43% (all payments). For self-employed individuals, lenders average the last two years of IRS Schedule C profits, making consistent tax filings critical to getting approved.',
    aboutText: 'Built for independent creators, consultants, and contractors. Unlike standard calculators, this looks at your self-employed net income verification hurdles to outline realistic ranges where a underwriter would feel safe.'
  },
  {
    id: 'debt-payoff',
    title: 'Smart Debt Payoff Planner (Avalanche vs. Snowball)',
    shortName: 'Debt Payoff',
    tagline: 'Compare payoff strategies, create an optimal payment timeline, and see exactly when you will be debt-free.',
    seoTitle: 'Debt Payoff Planner - Compare Snowball & Avalanche Payoff Timelines',
    seoDescription: 'Input multiple debts to compare the Debt Snowball and Debt Avalanche payment strategies side-by-side. Get a monthly payment schedule and interest savings projection.',
    fields: [
      {
        name: 'extraPayment',
        label: 'Extra Monthly Payment Budget',
        type: 'number',
        defaultValue: 300,
        min: 0,
        prefix: '$',
        tooltip: 'Additional cash you can put toward paying down debt on top of the minimum payments.'
      },
      {
        name: 'debts',
        label: 'Your Debts',
        type: 'debts',
        defaultValue: [
          { id: '1', name: 'Credit Card A', balance: 4500, interestRate: 21.9, minPayment: 135 },
          { id: '2', name: 'Student Loan', balance: 18000, interestRate: 5.5, minPayment: 210 },
          { id: '3', name: 'Auto Loan', balance: 9500, interestRate: 6.2, minPayment: 260 }
        ]
      }
    ],
    disclaimer: 'Disclaimer: Calculations assume interest rates remain constant and payments are made on time every month. Real debt instruments may contain variable interest rates, deferred interest periods, or fees that can affect schedules.',
    methodology: 'The comparison simulates two debt payment methods. The Debt Avalanche strategy directs extra payments to the debt with the highest interest rate first, minimizing overall interest expenses. The Debt Snowball strategy targets the smallest balances first to build emotional momentum. Both simulations maintain minimum payments on all debts and route freed-up capital dynamically as individual accounts reach a zero balance.',
    aboutText: 'This calculator is designed to visually demonstrate the trade-offs of interest savings vs. behavioral milestones, providing a clear comparison plan to help you stay motivated.'
  },
  {
    id: 'savings-projector',
    title: 'Self-Employed Savings & Growth Projector',
    shortName: 'Savings Projector',
    tagline: 'Project your savings growth curve with High-Yield Savings Accounts (HYSA) and run scenarios to speed up your target timelines.',
    seoTitle: 'Savings Growth Projector - Custom Financial Timeline Planner',
    seoDescription: 'Calculate compound savings progress with custom APY rates and review side-by-side growth comparisons showing what happens if you increase monthly savings.',
    fields: [
      {
        name: 'currentSavings',
        label: 'Initial Savings Balance',
        type: 'number',
        defaultValue: 5000,
        min: 0,
        prefix: '$'
      },
      {
        name: 'monthlyContribution',
        label: 'Monthly Contribution',
        type: 'number',
        defaultValue: 400,
        min: 0,
        prefix: '$'
      },
      {
        name: 'savingsGoal',
        label: 'Target Savings Goal',
        type: 'number',
        defaultValue: 30000,
        min: 100,
        prefix: '$'
      },
      {
        name: 'apy',
        label: 'Annual Interest Rate (APY)',
        type: 'number',
        defaultValue: 4.5,
        min: 0,
        max: 20,
        step: 0.1,
        suffix: '%',
        advanced: true,
        tooltip: 'The interest rate on your savings account (e.g. 4% to 5% is standard for HYSAs).'
      }
    ],
    disclaimer: 'Disclaimer: Projections assume compounding interest at a constant rate and steady contributions. In reality, savings interest rates fluctuate based on Federal Reserve adjustments, and emergency contributions may vary.',
    methodology: 'The calculator compounds savings interest monthly. The formula used is B(t) = B(t-1) * (1 + APY / 12) + C, where B represents the monthly balance and C represents the contribution. The scenarios project alternative savings tracks by adding $100/mo and $250/mo contributions, demonstrating the compounding acceleration of modest incremental monthly amounts.',
    aboutText: 'This tool was built to help freelancers and gig workers visualize how small, regular transfers to an emergency fund or retirement HYSAs scale over time, encouraging consistent saving behaviors.'
  }
];

// Calculation implementation functions (to be executed server-side for prediction results)

export function calculateEmiAffordability(inputs: {
  grossIncome: number;
  existingDebt: number;
  loanAmount: number;
  downPayment: number;
  interestRate: number;
  loanTenure: number;
}) {
  const { grossIncome, existingDebt, loanAmount, downPayment, interestRate, loanTenure } = inputs;

  const principal = Math.max(0, loanAmount - downPayment);
  const monthlyRate = interestRate / 100 / 12;
  const numMonths = loanTenure * 12;

  let emi = 0;
  if (principal > 0 && numMonths > 0) {
    if (monthlyRate === 0) {
      emi = principal / numMonths;
    } else {
      emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numMonths)) / 
            (Math.pow(1 + monthlyRate, numMonths) - 1);
    }
  }

  const totalPayment = emi * numMonths;
  const totalInterest = Math.max(0, totalPayment - principal);

  // Core underwriting metric: Debt-to-Income (DTI) ratio
  const totalMonthlyDebt = existingDebt + emi;
  const dti = grossIncome > 0 ? (totalMonthlyDebt / grossIncome) * 100 : 999;
  const housingDti = grossIncome > 0 ? (emi / grossIncome) * 100 : 999;

  let approvalRating = '';
  let approvalOddsRange = '';
  let ratingColor = '';
  let analysis = '';

  if (dti < 30) {
    approvalRating = 'Very High Likelihood';
    approvalOddsRange = '85% - 98%';
    ratingColor = 'emerald';
    analysis = 'Excellent debt profile. Lenders typically approve applications where total debts comprise less than 30% of income. Your margins leave room for income fluctuations common to freelancer schedules.';
  } else if (dti >= 30 && dti < 38) {
    approvalRating = 'High Likelihood';
    approvalOddsRange = '70% - 85%';
    ratingColor = 'teal';
    analysis = 'Strong profile. Standard mortgages easily accommodate DTI ratios under 36-38%. As a freelancer, keeping files clean (consistent tax history, tax write-offs that don\'t suppress net profits too much) makes this a very solid case.';
  } else if (dti >= 38 && dti < 45) {
    approvalRating = 'Moderate/Fair Likelihood';
    approvalOddsRange = '45% - 70%';
    ratingColor = 'amber';
    analysis = 'Moderate risk tier. Lenders commonly accept total debt ratios up to 43-45%. However, self-employed borrowers at this level will experience rigorous underwriting, requiring robust proof of reserves (6-12 months of mortgage payments in the bank).';
  } else if (dti >= 45 && dti < 50) {
    approvalRating = 'Low Likelihood';
    approvalOddsRange = '15% - 45%';
    ratingColor = 'orange';
    analysis = 'High risk. Conventional loans cap back-end DTI at 45% (sometimes 50% with automated underwriting approvals). You might need to look at non-QM (Qualified Mortgage) loans, which have higher interest rates, or increase your down payment.';
  } else {
    approvalRating = 'Unlikely Approval';
    approvalOddsRange = '< 15%';
    ratingColor = 'rose';
    analysis = 'Critical threshold. Lenders rarely approve mortgage loans where half of your pre-tax income is eaten up by housing and debt payments. To qualify, you must pay down existing balances, lower the target home price, or boost down payment reserves.';
  }

  // Suggesting actions to improve
  const recommendedDownPayment = Math.max(downPayment, Math.round(loanAmount * 0.20));
  const suggestedPrincipal = Math.max(0, loanAmount - (grossIncome * 0.36 * ((Math.pow(1 + monthlyRate, numMonths) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, numMonths))) + downPayment));
  
  return {
    emi: Math.round(emi * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    dti: Math.round(dti * 10) / 10,
    housingDti: Math.round(housingDti * 10) / 10,
    approvalRating,
    approvalOddsRange,
    ratingColor,
    analysis,
    suggestions: {
      recommendedDownPayment,
      targetDtiMonthlyLimit: Math.round(grossIncome * 0.36),
      safeEmiBudget: Math.round(Math.max(0, (grossIncome * 0.36) - existingDebt)),
    }
  };
}

export interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minPayment: number;
}

export function calculateDebtPayoff(inputs: {
  extraPayment: number;
  debts: Debt[];
}) {
  const { extraPayment, debts } = inputs;
  
  // Basic validation to avoid infinite loops
  if (debts.length === 0) {
    return { snowball: null, avalanche: null };
  }

  const simulate = (strategy: 'snowball' | 'avalanche') => {
    // Clone debts to avoid mutating
    let activeDebts: (Debt & { currentBalance: number })[] = debts.map(d => ({
      ...d,
      currentBalance: d.balance
    }));

    // Sort according to strategy
    const sortDebts = () => {
      if (strategy === 'snowball') {
        // Snowball: lowest balance first
        activeDebts.sort((a, b) => a.currentBalance - b.currentBalance);
      } else {
        // Avalanche: highest interest rate first
        activeDebts.sort((a, b) => b.interestRate - a.interestRate);
      }
    };

    let months = 0;
    let totalInterestPaid = 0;
    const history: { month: number; totalBalance: number; balances: Record<string, number> }[] = [];
    const monthlyHistoryMax = 360; // Max 30 years safety valve

    // Capture initial state
    const initialTotal = activeDebts.reduce((sum, d) => sum + d.currentBalance, 0);
    history.push({
      month: 0,
      totalBalance: initialTotal,
      balances: activeDebts.reduce((acc, d) => ({ ...acc, [d.id]: d.currentBalance }), {})
    });

    while (activeDebts.some(d => d.currentBalance > 0) && months < monthlyHistoryMax) {
      months++;
      let interestThisMonth = 0;

      // 1. Accrue monthly interest
      activeDebts.forEach(d => {
        if (d.currentBalance > 0) {
          const monthlyRate = d.interestRate / 100 / 12;
          const interest = d.currentBalance * monthlyRate;
          d.currentBalance += interest;
          interestThisMonth += interest;
          totalInterestPaid += interest;
        }
      });

      // Sort again in case balances changed (for snowball, though usually sorting is stable)
      sortDebts();

      // 2. Pay minimums first
      let totalMinPaid = 0;
      let minPaymentsApplied = activeDebts.map(d => {
        if (d.currentBalance <= 0) return 0;
        const payment = Math.min(d.currentBalance, d.minPayment);
        d.currentBalance -= payment;
        totalMinPaid += payment;
        return payment;
      });

      // 3. Collect extra budget + leftover minimums
      // Total monthly budget committed = sum of minimums of ALL debts at start + extraPayment
      const baseMonthlyBudget = debts.reduce((sum, d) => sum + d.minPayment, 0) + extraPayment;
      // Budget left to apply to target debt = Total Budget - what we actually paid as minimums
      let extraBudget = baseMonthlyBudget - totalMinPaid;

      // Apply extra budget to first debt that still has a balance
      for (let i = 0; i < activeDebts.length; i++) {
        const d = activeDebts[i];
        if (d.currentBalance > 0 && extraBudget > 0) {
          const extraPaymentAmount = Math.min(d.currentBalance, extraBudget);
          d.currentBalance -= extraPaymentAmount;
          extraBudget -= extraPaymentAmount;
        }
      }

      // Record monthly state
      const totalBalance = Math.round(activeDebts.reduce((sum, d) => sum + Math.max(0, d.currentBalance), 0));
      history.push({
        month: months,
        totalBalance,
        balances: activeDebts.reduce((acc, d) => ({ ...acc, [d.id]: Math.round(Math.max(0, d.currentBalance)) }), {})
      });

      // If all balances are 0, break
      if (totalBalance <= 0) {
        break;
      }
    }

    return {
      strategy,
      months,
      totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
      totalPayments: Math.round((initialTotal + totalInterestPaid) * 100) / 100,
      history
    };
  };

  const avalanche = simulate('avalanche');
  const snowball = simulate('snowball');

  const interestSaved = Math.round((snowball.totalInterestPaid - avalanche.totalInterestPaid) * 100) / 100;
  const timeDifferenceMonths = snowball.months - avalanche.months;

  return {
    avalanche,
    snowball,
    interestSaved,
    timeDifferenceMonths,
    fasterStrategy: timeDifferenceMonths > 0 ? 'Avalanche' : timeDifferenceMonths < 0 ? 'Snowball' : 'Equal',
    cheaperStrategy: interestSaved > 0 ? 'Avalanche' : interestSaved < 0 ? 'Snowball' : 'Equal'
  };
}

export function calculateSavingsProjector(inputs: {
  currentSavings: number;
  monthlyContribution: number;
  savingsGoal: number;
  apy: number;
}) {
  const { currentSavings, monthlyContribution, savingsGoal, apy } = inputs;

  const simulateSavings = (monthlyCont: number) => {
    let balance = currentSavings;
    let months = 0;
    const monthlyRate = apy / 100 / 12;
    const history: { month: number; balance: number; interestEarned: number }[] = [];
    let totalInterestEarned = 0;
    const maxMonths = 360; // 30 years ceiling

    history.push({ month: 0, balance: Math.round(balance), interestEarned: 0 });

    while (balance < savingsGoal && months < maxMonths) {
      months++;
      const interest = balance * monthlyRate;
      balance = balance + interest + monthlyCont;
      totalInterestEarned += interest;
      history.push({
        month: months,
        balance: Math.round(balance),
        interestEarned: Math.round(totalInterestEarned)
      });
    }

    return {
      months,
      finalBalance: Math.round(balance),
      totalInterestEarned: Math.round(totalInterestEarned),
      history
    };
  };

  const baseline = simulateSavings(monthlyContribution);
  const scenarioPlus100 = simulateSavings(monthlyContribution + 100);
  const scenarioPlus250 = simulateSavings(monthlyContribution + 250);

  return {
    baseline,
    scenarioPlus100,
    scenarioPlus250,
    goalReached: baseline.finalBalance >= savingsGoal,
    apy
  };
}
