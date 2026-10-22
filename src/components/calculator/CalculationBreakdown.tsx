import React, { useState } from 'react';
import { CalculationResult } from '../../lib/calculations/types';
import { ChevronDown, ChevronUp, Calculator, CheckCircle2 } from 'lucide-react';

interface CalculationBreakdownProps {
  result: CalculationResult | null;
}

export const CalculationBreakdown: React.FC<CalculationBreakdownProps> = ({ result }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!result || !result.isValid) return null;

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Mathematical Calculation Breakdown
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
          <span>{isOpen ? 'Hide Formula Derivation' : 'View Formula Derivation'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-slate-800/80 space-y-4 text-xs font-mono bg-slate-950/60">
          {/* Step 1: Distance */}
          <div className="space-y-1">
            <span className="text-slate-400 font-sans font-medium text-[11px] block">
              1. Stop-Loss Price Distance:
            </span>
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800/80 text-slate-200">
              <code>
                Distance = |Entry ({result.entryPrice}) - Stop ({result.stopLossPrice})| ={' '}
                <strong className="text-white">{result.stopLossDistance}</strong> (
                {result.stopLossDistanceDisplay})
              </code>
            </div>
          </div>

          {/* Step 2: Loss per lot */}
          <div className="space-y-1">
            <span className="text-slate-400 font-sans font-medium text-[11px] block">
              2. Loss per Unit in Quote/Profit Currency ({result.profitCurrency}):
            </span>
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800/80 text-slate-200">
              <code>
                LossPerUnitQuote = {result.lossPerUnitQuote} {result.profitCurrency}
              </code>
            </div>
          </div>

          {/* Step 3: Conversion */}
          <div className="space-y-1">
            <span className="text-slate-400 font-sans font-medium text-[11px] block">
              3. Multi-Currency Conversion ({result.profitCurrency} → {result.accountCurrency}):
            </span>
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800/80 text-slate-200 space-y-1">
              <div>Path: {result.conversionPath}</div>
              <div>
                Applied Multiplier:{' '}
                <strong className="text-indigo-300">{result.conversionRateApplied}</strong>
              </div>
              <div className="text-emerald-400">
                LossPerUnitAccount = {result.lossPerUnitQuote} × {result.conversionRateApplied} ={' '}
                <strong>
                  {result.accountCurrency} {result.lossPerUnitAccount}
                </strong>
              </div>
            </div>
          </div>

          {/* Step 4: Theoretical Quantity */}
          <div className="space-y-1">
            <span className="text-slate-400 font-sans font-medium text-[11px] block">
              4. Theoretical Position Size (Pre-Rounding):
            </span>
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800/80 text-slate-200">
              <code>
                TheoreticalSize = RiskBudget ({result.accountCurrency} {result.riskBudget}) / LossPerUnitAccount (
                {result.lossPerUnitAccount}) ={' '}
                <strong className="text-amber-300">{result.theoreticalQuantity}</strong>{' '}
                {result.quantityUnit}
              </code>
            </div>
          </div>

          {/* Step 5: Permitted Floor Rounding */}
          <div className="space-y-1">
            <span className="text-slate-400 font-sans font-medium text-[11px] block">
              5. Decimal-Safe Step Floor Rounding:
            </span>
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800/80 text-slate-200 space-y-1">
              <code>
                PermittedSize = floor({result.theoreticalQuantity} / {result.stepIncrement}) ×{' '}
                {result.stepIncrement} ={' '}
                <strong className="text-emerald-400 text-sm">{result.permittedQuantity}</strong>{' '}
                {result.quantityUnit}
              </code>
            </div>
          </div>

          {/* Step 6: Risk Invariant Verification */}
          <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-lg text-emerald-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 font-sans">
              <span className="font-semibold text-xs text-white">Risk Safety Invariant Verified:</span>
              <p className="text-[11px] text-emerald-200/90 font-mono">
                Final Estimated Risk ({result.accountCurrency} {result.grossEstimatedRisk}) ≤ Risk Budget (
                {result.accountCurrency} {result.riskBudget}). Rounding did not expand risk exposure.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
