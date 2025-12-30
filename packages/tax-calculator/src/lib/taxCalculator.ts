/**
 * Nigerian Personal Income Tax Calculator
 * Based on Personal Income Tax Act (PITA) and PAYE system
 */

// Tax bands as per Nigerian PITA (progressive taxation)
export const TAX_BANDS = [
  { limit: 300000, rate: 0.07 },   // First ₦300,000 @ 7%
  { limit: 300000, rate: 0.11 },   // Next ₦300,000 @ 11%
  { limit: 500000, rate: 0.15 },   // Next ₦500,000 @ 15%
  { limit: 500000, rate: 0.19 },   // Next ₦500,000 @ 19%
  { limit: 1600000, rate: 0.21 },  // Next ₦1,600,000 @ 21%
  { limit: Infinity, rate: 0.24 }, // Balance @ 24%
] as const;

// Consolidated Relief Allowance (CRA) constants
export const CRA_PERCENTAGE = 0.20; // 20% of gross income
export const CRA_FIXED_AMOUNT = 200000; // ₦200,000 fixed addition

// Standard deduction rates
export const PENSION_RATE = 0.08; // 8% of gross income
export const NHF_RATE = 0.025;    // 2.5% of gross income

export type IncomeFrequency = 'monthly' | 'yearly';
export type IncomeType = 'salary' | 'self-employed';

export interface TaxInputs {
  income: number;
  frequency: IncomeFrequency;
  incomeType: IncomeType;
  includePension: boolean;
  includeNHF: boolean;
  otherDeductions: number;
}

export interface TaxBreakdown {
  grossAnnualIncome: number;
  cra: number;
  pensionDeduction: number;
  nhfDeduction: number;
  otherDeductions: number;
  totalDeductions: number;
  taxableIncome: number;
  taxPayable: number;
  monthlyTax: number;
  effectiveRate: number;
  netAnnualIncome: number;
  netMonthlyIncome: number;
  bandBreakdown: Array<{
    band: string;
    amount: number;
    rate: number;
    tax: number;
  }>;
}

/**
 * Calculate Consolidated Relief Allowance (CRA)
 * CRA = (20% of Gross Annual Income) + ₦200,000
 */
export function calculateCRA(grossAnnualIncome: number): number {
  return (grossAnnualIncome * CRA_PERCENTAGE) + CRA_FIXED_AMOUNT;
}

/**
 * Calculate pension deduction (8% of gross income)
 */
export function calculatePension(grossAnnualIncome: number): number {
  return grossAnnualIncome * PENSION_RATE;
}

/**
 * Calculate NHF deduction (2.5% of gross income)
 */
export function calculateNHF(grossAnnualIncome: number): number {
  return grossAnnualIncome * NHF_RATE;
}

/**
 * Calculate tax using progressive tax bands
 * Applies Nigerian tax bands progressively
 */
export function calculateProgressiveTax(taxableIncome: number): {
  totalTax: number;
  breakdown: Array<{ band: string; amount: number; rate: number; tax: number }>;
} {
  // If taxable income is zero or negative, no tax is payable
  if (taxableIncome <= 0) {
    return { totalTax: 0, breakdown: [] };
  }

  let remainingIncome = taxableIncome;
  let totalTax = 0;
  const breakdown: Array<{ band: string; amount: number; rate: number; tax: number }> = [];

  for (const band of TAX_BANDS) {
    if (remainingIncome <= 0) break;

    const taxableAtThisBand = Math.min(remainingIncome, band.limit);
    const taxAtThisBand = taxableAtThisBand * band.rate;

    totalTax += taxAtThisBand;
    remainingIncome -= taxableAtThisBand;

    breakdown.push({
      band: band.limit === Infinity ? 'Above ₦3,200,000' : `₦${band.limit.toLocaleString()}`,
      amount: taxableAtThisBand,
      rate: band.rate,
      tax: taxAtThisBand,
    });
  }

  return { totalTax, breakdown };
}

/**
 * Main tax calculation function
 * Handles all inputs and returns comprehensive breakdown
 */
export function calculateNigerianTax(inputs: TaxInputs): TaxBreakdown {
  // Convert to annual income if monthly
  const grossAnnualIncome = inputs.frequency === 'monthly' 
    ? inputs.income * 12 
    : inputs.income;

  // Calculate CRA (mandatory for all income types)
  const cra = calculateCRA(grossAnnualIncome);

  // Calculate optional deductions
  const pensionDeduction = inputs.includePension ? calculatePension(grossAnnualIncome) : 0;
  const nhfDeduction = inputs.includeNHF ? calculateNHF(grossAnnualIncome) : 0;
  const otherDeductions = inputs.otherDeductions || 0;

  // Total deductions
  const totalDeductions = cra + pensionDeduction + nhfDeduction + otherDeductions;

  // Calculate taxable income
  const taxableIncome = Math.max(0, grossAnnualIncome - totalDeductions);

  // Calculate progressive tax
  const { totalTax, breakdown } = calculateProgressiveTax(taxableIncome);

  // Calculate net income
  const netAnnualIncome = grossAnnualIncome - totalTax - pensionDeduction - nhfDeduction - otherDeductions;
  const netMonthlyIncome = netAnnualIncome / 12;

  // Calculate effective tax rate
  const effectiveRate = grossAnnualIncome > 0 ? (totalTax / grossAnnualIncome) * 100 : 0;

  return {
    grossAnnualIncome,
    cra,
    pensionDeduction,
    nhfDeduction,
    otherDeductions,
    totalDeductions,
    taxableIncome,
    taxPayable: totalTax,
    monthlyTax: totalTax / 12,
    effectiveRate,
    netAnnualIncome,
    netMonthlyIncome,
    bandBreakdown: breakdown,
  };
}

/**
 * Generate human-readable explanation of the calculation
 */
export function generateExplanation(breakdown: TaxBreakdown): string {
  const parts: string[] = [];

  parts.push(`Your gross annual income is ₦${breakdown.grossAnnualIncome.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`);
  
  parts.push(`\nConsolidated Relief Allowance (CRA) of ₦${breakdown.cra.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} is deducted (20% of gross + ₦200,000).`);

  if (breakdown.pensionDeduction > 0) {
    parts.push(`Pension contribution of ₦${breakdown.pensionDeduction.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (8% of gross) is deducted.`);
  }

  if (breakdown.nhfDeduction > 0) {
    parts.push(`NHF contribution of ₦${breakdown.nhfDeduction.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (2.5% of gross) is deducted.`);
  }

  if (breakdown.otherDeductions > 0) {
    parts.push(`Other deductions of ₦${breakdown.otherDeductions.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} are applied.`);
  }

  parts.push(`\nYour taxable income is ₦${breakdown.taxableIncome.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`);

  if (breakdown.taxableIncome > 0) {
    parts.push(`\nTax is calculated progressively across Nigerian tax bands:`);
    breakdown.bandBreakdown.forEach((band) => {
      parts.push(`  • ${band.band} @ ${(band.rate * 100).toFixed(0)}%: ₦${band.tax.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    });
  } else {
    parts.push(`\nNo tax is payable as your taxable income is ₦0 or below.`);
  }

  parts.push(`\nTotal annual tax: ₦${breakdown.taxPayable.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${breakdown.effectiveRate.toFixed(2)}% effective rate).`);

  return parts.join('\n');
}

