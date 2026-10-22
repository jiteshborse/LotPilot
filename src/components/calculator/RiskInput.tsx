import React from 'react';
import { RiskMode, AccountBaseMode } from '../../lib/calculations/types';
import { Input } from '../ui/Input';
import { ShieldCheck, Percent, DollarSign } from 'lucide-react';
import Decimal from 'decimal.js';

interface RiskInputProps {
  riskMode: RiskMode;
  onRiskModeChange: (mode: RiskMode) => void;
  
  accountCurrency: string;
  onAccountCurrencyChange: (currency: string) => void;
  
  riskCashAmount: string | number;
  onRiskCashAmountChange: (val: string) => void;
  
  accountEquity: string | number;
  onAccountEquityChange: (val: string) => void;
  
  riskPercentage: string | number;
  onRiskPercentageChange: (val: string) => void;
  
  accountBaseMode: AccountBaseMode;
  onAccountBaseModeChange: (mode: AccountBaseMode) => void;
}

const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'CHF', 'JPY', 'INR'];

export const RiskInput: React.FC<RiskInputProps> = ({
  riskMode,
  onRiskModeChange,
  accountCurrency,
  onAccountCurrencyChange,
  riskCashAmount,
  onRiskCashAmountChange,
  accountEquity,
  onAccountEquityChange,
  riskPercentage,
  onRiskPercentageChange,
  accountBaseMode,
  onAccountBaseModeChange,
}) => {
  // Compute live preview budget when in percentage mode
  let percentageDerivedBudget = '0.00';
  try {
    if (accountEquity && riskPercentage) {
      const eq = new Decimal(accountEquity);
      const pct = new Decimal(riskPercentage);
      if (eq.gt(0) && pct.gt(0)) {
        percentageDerivedBudget = eq.mul(pct).div(100).toFixed(2);
      }
    }
  } catch {
    percentageDerivedBudget = '0.00';
  }

  return (
    <div className="w-full space-y-3 p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            4. Risk Settings & Account Currency
          </label>
        </div>

        {/* Currency Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400">Account Cur:</span>
          <select
            value={accountCurrency}
            onChange={(e) => onAccountCurrencyChange(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono font-semibold text-indigo-300 px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            {SUPPORTED_CURRENCIES.map((cur) => (
              <option key={cur} value={cur} className="bg-slate-900 text-white">
                {cur}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Risk Mode Switcher: Fixed Cash vs % */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onRiskModeChange('fixed_cash')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            riskMode === 'fixed_cash'
              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Fixed Cash Risk ({accountCurrency})</span>
        </button>

        <button
          type="button"
          onClick={() => onRiskModeChange('percentage')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            riskMode === 'percentage'
              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>Percentage of Account</span>
        </button>
      </div>

      {/* Mode-specific Fields */}
      {riskMode === 'fixed_cash' ? (
        <div className="space-y-2">
          <Input
            label={`Maximum Risk Budget (${accountCurrency})`}
            type="number"
            step="any"
            value={riskCashAmount}
            onChange={(e) => onRiskCashAmountChange(e.target.value)}
            placeholder="e.g. 20, 50, 100"
            leftAddon={accountCurrency}
          />

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-500">Quick presets:</span>
            {[20, 50, 100, 250, 500].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => onRiskCashAmountChange(amt.toString())}
                className="px-2 py-0.5 text-[11px] font-mono bg-slate-950 border border-slate-800 hover:border-indigo-500/60 text-slate-300 hover:text-white rounded-md transition-colors cursor-pointer"
              >
                {amt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Calculate based on:</span>
              <button
                type="button"
                onClick={() => onAccountBaseModeChange('balance')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  accountBaseMode === 'balance'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Balance
              </button>
              <button
                type="button"
                onClick={() => onAccountBaseModeChange('equity')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  accountBaseMode === 'equity'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Equity
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label={`Account ${accountBaseMode === 'balance' ? 'Balance' : 'Equity'} (${accountCurrency})`}
              type="number"
              step="any"
              value={accountEquity}
              onChange={(e) => onAccountEquityChange(e.target.value)}
              placeholder="e.g. 10000"
              leftAddon={accountCurrency}
            />

            <Input
              label="Risk Percentage (%)"
              type="number"
              step="0.1"
              value={riskPercentage}
              onChange={(e) => onRiskPercentageChange(e.target.value)}
              placeholder="e.g. 1.0"
              rightAddon="%"
            />
          </div>

          {/* Quick % buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500">Presets:</span>
              {[0.5, 1.0, 1.5, 2.0].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => onRiskPercentageChange(pct.toString())}
                  className="px-2 py-0.5 text-[11px] font-mono bg-slate-950 border border-slate-800 hover:border-indigo-500/60 text-slate-300 hover:text-white rounded-md transition-colors cursor-pointer"
                >
                  {pct}%
                </button>
              ))}
            </div>

            <div className="text-[11px] text-indigo-300 font-mono">
              Calculated Budget: <strong>{accountCurrency} {percentageDerivedBudget}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
