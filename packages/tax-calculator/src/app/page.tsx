'use client';

import { useState } from 'react';
import { 
  calculateNigerianTax, 
  generateExplanation,
  type TaxInputs,
  type IncomeFrequency,
  type IncomeType 
} from '@/lib/taxCalculator';

export default function TaxCalculator() {
  const [income, setIncome] = useState<string>('');
  const [frequency, setFrequency] = useState<IncomeFrequency>('monthly');
  const [incomeType, setIncomeType] = useState<IncomeType>('salary');
  const [includePension, setIncludePension] = useState(true);
  const [includeNHF, setIncludeNHF] = useState(true);
  const [otherDeductions, setOtherDeductions] = useState<string>('');
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = () => {
    const incomeValue = parseFloat(income) || 0;
    const otherDeductionsValue = parseFloat(otherDeductions) || 0;

    if (incomeValue <= 0) {
      alert('Please enter a valid income amount');
      return;
    }

    setShowResults(true);
  };

  const handleReset = () => {
    setIncome('');
    setFrequency('monthly');
    setIncomeType('salary');
    setIncludePension(true);
    setIncludeNHF(true);
    setOtherDeductions('');
    setShowResults(false);
  };

  const inputs: TaxInputs = {
    income: parseFloat(income) || 0,
    frequency,
    incomeType,
    includePension,
    includeNHF,
    otherDeductions: parseFloat(otherDeductions) || 0,
  };

  const results = showResults ? calculateNigerianTax(inputs) : null;
  const explanation = results ? generateExplanation(results) : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-2">
            🇳🇬 Nigerian Tax Calculator
          </h1>
          <p className="text-gray-600 text-lg">
            Calculate your Personal Income Tax (PAYE) accurately
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Details</h2>

            {/* Income Amount */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Income Amount (₦)
              </label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="Enter your income"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
              />
            </div>

            {/* Income Frequency */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Income Frequency
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setFrequency('monthly')}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    frequency === 'monthly'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setFrequency('yearly')}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    frequency === 'yearly'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>

            {/* Income Type */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Income Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIncomeType('salary')}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    incomeType === 'salary'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Salary (PAYE)
                </button>
                <button
                  onClick={() => setIncomeType('self-employed')}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    incomeType === 'self-employed'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Self-Employed
                </button>
              </div>
            </div>

            {/* Deductions */}
            <div className="mb-5 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">Optional Deductions</h3>
              
              <label className="flex items-center mb-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePension}
                  onChange={(e) => setIncludePension(e.target.checked)}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <span className="ml-3 text-gray-700">Pension (8% of gross)</span>
              </label>

              <label className="flex items-center mb-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNHF}
                  onChange={(e) => setIncludeNHF(e.target.checked)}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <span className="ml-3 text-gray-700">NHF (2.5% of gross)</span>
              </label>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Other Deductions (₦)
                </label>
                <input
                  type="number"
                  value={otherDeductions}
                  onChange={(e) => setOtherDeductions(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCalculate}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
              >
                Calculate Tax
              </button>
              {showResults && (
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tax Breakdown</h2>

            {!showResults ? (
              <div className="text-center py-12 text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <p className="text-lg">Enter your details and click Calculate</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Key Results */}
                <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Annual Tax Payable</p>
                    <p className="text-3xl font-bold text-green-700">
                      ₦{results?.taxPayable.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Monthly Tax</p>
                      <p className="font-semibold text-gray-800">
                        ₦{results?.monthlyTax.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Effective Rate</p>
                      <p className="font-semibold text-gray-800">
                        {results?.effectiveRate.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Net Income */}
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Net Annual Income</p>
                      <p className="text-lg font-bold text-blue-700">
                        ₦{results?.netAnnualIncome.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Net Monthly Income</p>
                      <p className="text-lg font-bold text-blue-700">
                        ₦{results?.netMonthlyIncome.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Calculation Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gross Annual Income</span>
                      <span className="font-medium text-gray-900">
                        ₦{results?.grossAnnualIncome.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>CRA (20% + ₦200k)</span>
                      <span className="font-medium">
                        -₦{results?.cra.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    {results && results.pensionDeduction > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Pension (8%)</span>
                        <span className="font-medium">
                          -₦{results.pensionDeduction.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}
                    {results && results.nhfDeduction > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>NHF (2.5%)</span>
                        <span className="font-medium">
                          -₦{results.nhfDeduction.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}
                    {results && results.otherDeductions > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Other Deductions</span>
                        <span className="font-medium">
                          -₦{results.otherDeductions.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold">
                      <span className="text-gray-800">Taxable Income</span>
                      <span className="text-gray-900">
                        ₦{results?.taxableIncome.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tax Band Breakdown */}
                {results && results.bandBreakdown.length > 0 && (
                  <div className="border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Progressive Tax Bands</h3>
                    <div className="space-y-2 text-sm">
                      {results.bandBreakdown.map((band, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-600">
                            {band.band} @ {(band.rate * 100).toFixed(0)}%
                          </span>
                          <span className="font-medium text-gray-900">
                            ₦{band.tax.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Explanation */}
                <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                  {explanation}
                </div>

                {/* Disclaimer */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-gray-700">
                  <p className="font-semibold text-yellow-800 mb-1">⚠️ Disclaimer</p>
                  <p>
                    This is an estimation tool based on the Nigerian Personal Income Tax Act (PITA). 
                    Actual tax liability may vary based on specific circumstances, state tax laws, 
                    and other factors. Please consult a qualified tax professional for accurate advice.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Based on Nigerian Personal Income Tax Act (PITA) • Progressive Tax Bands Applied</p>
        </footer>
      </div>
    </div>
  );
}

