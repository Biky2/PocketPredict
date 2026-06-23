import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';
import {
  calculateEmiAffordability,
  calculateDebtPayoff,
  calculateSavingsProjector,
  Debt
} from '@/data/calculators';

export async function POST(req: Request) {
  try {
    // 1. Resolve client IP and rate-limit
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const rateLimitResult = rateLimit(ip, { limit: 20, windowMs: 60 * 1000 });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { calculatorId, fields, turnstileToken } = body;

    if (!calculatorId) {
      return NextResponse.json({ error: 'Missing calculatorId' }, { status: 400 });
    }

    // 2. Optional: Cloudflare Turnstile bot protection
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret && turnstileToken) {
      try {
        const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
        const verifyRes = await fetch(verifyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `secret=${encodeURIComponent(turnstileSecret)}&response=${encodeURIComponent(turnstileToken)}&remoteip=${encodeURIComponent(ip)}`
        });
        const verifyJson = await verifyRes.json();
        if (!verifyJson.success) {
          return NextResponse.json({ error: 'Spam/bot check failed. Please reload and try again.' }, { status: 400 });
        }
      } catch (err) {
        console.error('Turnstile verification error:', err);
        // We log and continue in case of Cloudflare outage to maintain reliability
      }
    }

    // 3. Process the calculator logic based on the ID with strict validation
    if (calculatorId === 'emi-affordability') {
      const grossIncome = Math.max(0, Number(fields.grossIncome) || 0);
      const existingDebt = Math.max(0, Number(fields.existingDebt) || 0);
      const loanAmount = Math.max(0, Number(fields.loanAmount) || 0);
      const downPayment = Math.max(0, Number(fields.downPayment) || 0);
      const interestRate = Math.min(100, Math.max(0, Number(fields.interestRate) || 0));
      const loanTenure = Math.min(100, Math.max(1, Number(fields.loanTenure) || 30));

      const result = calculateEmiAffordability({
        grossIncome,
        existingDebt,
        loanAmount,
        downPayment,
        interestRate,
        loanTenure
      });

      return NextResponse.json({ success: true, result });
    } 
    
    else if (calculatorId === 'debt-payoff') {
      const extraPayment = Math.max(0, Number(fields.extraPayment) || 0);
      const rawDebts = Array.isArray(fields.debts) ? fields.debts : [];
      
      // Sanitize debt structures
      const debts: Debt[] = rawDebts.map((d: any) => ({
        id: String(d.id || Math.random()),
        name: String(d.name || 'Debt').substring(0, 50),
        balance: Math.max(0, Number(d.balance) || 0),
        interestRate: Math.min(100, Math.max(0, Number(d.interestRate) || 0)),
        minPayment: Math.max(0, Number(d.minPayment) || 0)
      })).filter((d: Debt) => d.balance > 0);

      if (debts.length === 0) {
        return NextResponse.json({ error: 'Please enter at least one debt with a balance.' }, { status: 400 });
      }

      // Check if minimum payments exceed budget or cause infinite loops
      const sumMinPayments = debts.reduce((sum, d) => sum + d.minPayment, 0);
      if (sumMinPayments <= 0) {
        return NextResponse.json({ error: 'Debts must have minimum monthly payments greater than zero.' }, { status: 400 });
      }

      const result = calculateDebtPayoff({ extraPayment, debts });
      return NextResponse.json({ success: true, result });
    } 
    
    else if (calculatorId === 'savings-projector') {
      const currentSavings = Math.max(0, Number(fields.currentSavings) || 0);
      const monthlyContribution = Math.max(0, Number(fields.monthlyContribution) || 0);
      const savingsGoal = Math.max(1, Number(fields.savingsGoal) || 0);
      const apy = Math.min(100, Math.max(0, Number(fields.apy) || 0));

      if (monthlyContribution <= 0 && apy <= 0) {
        return NextResponse.json({ error: 'You need either a positive monthly contribution or a positive APY to project savings growth.' }, { status: 400 });
      }

      const result = calculateSavingsProjector({
        currentSavings,
        monthlyContribution,
        savingsGoal,
        apy
      });

      return NextResponse.json({ success: true, result });
    }

    return NextResponse.json({ error: 'Invalid calculatorId' }, { status: 400 });

  } catch (err: any) {
    console.error('API Error in route:', err);
    return NextResponse.json({ error: 'An unexpected server error occurred: ' + err.message }, { status: 500 });
  }
}
