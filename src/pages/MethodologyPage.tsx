import React from 'react';
import { Container } from '../components/layout/Container';
import { Badge } from '../components/ui/Badge';
import { BookOpen, ShieldCheck, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="py-6 space-y-10">
      <Container size="xl">
        {/* Header */}
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Financial Calculation Methodology
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            LotPilot operates on strict mathematical principles, using decimal-safe floating-point elimination and instrument-specific payoff models. Read the complete quantitative specifications below.
          </p>
        </div>

        {/* Section 1: Golden Rules */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span>1. Core Invariants & Golden Rules</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <span className="font-bold text-emerald-400 block">Invariant #1</span>
              <strong className="text-white text-sm block">Risk Budget Ceiling</strong>
              <p className="text-slate-400 leading-relaxed font-mono">
                Estimated Gross Stop Loss Risk ≤ Requested Risk Budget
              </p>
              <p className="text-slate-500 text-[11px]">
                Rounding must never increase position quantity above the theoretical maximum.
              </p>
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <span className="font-bold text-indigo-400 block">Invariant #2</span>
              <strong className="text-white text-sm block">Strict Floor Step Rounding</strong>
              <p className="text-slate-400 leading-relaxed font-mono">
                Q_final = floor(Q_theoretical / Step) × Step
              </p>
              <p className="text-slate-500 text-[11px]">
                All integer and fractional lot boundaries strictly floor down to permitted broker steps.
              </p>
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <span className="font-bold text-purple-400 block">Invariant #3</span>
              <strong className="text-white text-sm block">Zero Silent Guessing</strong>
              <p className="text-slate-400 leading-relaxed font-mono">
                No Missing Specifications Allowed
              </p>
              <p className="text-slate-500 text-[11px]">
                If a multiplier, tick size, or conversion rate is missing, calculation is safely halted.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Mathematical Formulations by Asset Class */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight">
            2. Mathematical Formulations by Asset Class
          </h2>

          {/* Forex */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 text-xs leading-relaxed">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Forex Currency Pairs</h3>
              <Badge variant="blue" size="sm">
                pipSize & contractSize
              </Badge>
            </div>
            <p className="text-slate-300">
              For a pair with Base currency $B$, Quote currency $Q$, contract size $C$ (typically 100,000 units), and pip size $P$ (0.0001 for non-JPY, 0.01 for JPY):
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono space-y-1 text-slate-200">
              <div>StopDistance = |Entry - StopLoss|</div>
              <div>Pips = StopDistance / pipSize</div>
              <div>LossPerLot_Quote = StopDistance × contractSize</div>
              <div>LossPerLot_Account = LossPerLot_Quote × QuoteToAccountRate</div>
              <div>TheoreticalLots = RiskBudget / LossPerLot_Account</div>
              <div className="text-emerald-400">
                PermittedLots = floor(TheoreticalLots / quantityStep) × quantityStep
              </div>
            </div>
            <p className="text-slate-400 text-[11px]">
              Note: When the quote currency equals the account currency (e.g. EURUSD with USD account), QuoteToAccountRate = 1.0. For USDCHF with a USD account, QuoteToAccountRate = 1 / USDCHF_rate.
            </p>
          </div>

          {/* Metals & Commodities */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 text-xs leading-relaxed">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Precious Metals & Commodity CFDs</h3>
              <Badge variant="amber" size="sm">
                Ounces & Barrels
              </Badge>
            </div>
            <p className="text-slate-300">
              For Gold (XAUUSD, 100 troy ounces/lot), Silver (XAGUSD, 5,000 ounces/lot), or WTI Oil (1,000 barrels/lot):
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono space-y-1 text-slate-200">
              <div>StopDistance = |Entry - StopLoss| (in USD per ounce/barrel)</div>
              <div>LossPerLot_USD = StopDistance × contractSize</div>
              <div>TheoreticalLots = RiskBudget_USD / LossPerLot_USD</div>
              <div className="text-emerald-400">
                PermittedLots = floor(TheoreticalLots / quantityStep) × quantityStep
              </div>
            </div>
          </div>

          {/* Exchange Futures */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 text-xs leading-relaxed">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Exchange-Traded Futures (CME / NYMEX)</h3>
              <Badge variant="cyan" size="sm">
                Tick Size & Tick Value
              </Badge>
            </div>
            <p className="text-slate-300">
              Futures contracts have fixed exchange-stipulated tick increments and dollar values (e.g. E-mini S&P 500 ES has 0.25 tick = $12.50):
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono space-y-1 text-slate-200">
              <div>Ticks = |Entry - StopLoss| / tickSize</div>
              <div>LossPerContract = Ticks × tickValue</div>
              <div>TheoreticalContracts = RiskBudget / LossPerContract</div>
              <div className="text-emerald-400">
                PermittedContracts = floor(TheoreticalContracts / 1) (Whole contracts)
              </div>
            </div>
          </div>

          {/* Indian Derivatives */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 text-xs leading-relaxed">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Indian Equity Derivatives (NSE F&O)</h3>
              <Badge variant="teal" size="sm">
                Exchange Lot Bundle
              </Badge>
            </div>
            <p className="text-slate-300">
              NSE index futures enforce mandatory lot bundling (e.g. NIFTY 50 = 25 shares per lot, BANKNIFTY = 15 shares per lot). Position sizes must be an exact integer multiple of the exchange lot bundle:
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono space-y-1 text-slate-200">
              <div>LossPerShare = |Entry - StopLoss| in INR</div>
              <div>TheoreticalShares = RiskBudget_INR / LossPerShare</div>
              <div className="text-emerald-400">
                PermittedShares = floor(TheoreticalShares / exchangeLotSize) × exchangeLotSize
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Regression Cases */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">
            3. Verification Benchmarks & Regression Proofs
          </h2>
          <p className="text-xs text-slate-300">
            Below are the exact input parameters and mathematical outputs validated in LotPilot's automated test suite:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
              <span className="text-indigo-400 font-bold block">Case A: EURUSD Short</span>
              <div className="text-slate-400">Entry: 1.13530 | Stop: 1.13586 | Risk: $20.00</div>
              <div className="text-slate-300">Distance: 0.00056 (5.6 pips)</div>
              <div className="text-slate-300">Theoretical: 0.357142 lots</div>
              <div className="text-emerald-400 font-bold">Permitted: 0.35 lots | Risk: $19.60</div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
              <span className="text-indigo-400 font-bold block">Case B: AUDUSD Short</span>
              <div className="text-slate-400">Entry: 0.70214 | Stop: 0.70248 | Risk: $50.00</div>
              <div className="text-slate-300">Distance: 0.00034 (3.4 pips)</div>
              <div className="text-slate-300">Theoretical: 1.470588 lots</div>
              <div className="text-emerald-400 font-bold">Permitted: 1.47 lots | Risk: $49.98</div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
              <span className="text-indigo-400 font-bold block">Case C1 & C2: XAUUSD Short</span>
              <div className="text-slate-400">Entry: 4164.00 | Stop: 4171.00 | Risk: $20.00 (100 oz)</div>
              <div className="text-slate-300">Distance: $7.00 | Loss/lot: $700.00</div>
              <div className="text-slate-300">Step 0.001: 0.028 lots → $19.60 risk</div>
              <div className="text-emerald-400 font-bold">Step 0.01: 0.02 lots → $14.00 risk</div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
              <span className="text-indigo-400 font-bold block">Case D: BTCUSD Short</span>
              <div className="text-slate-400">Entry: 83280 | Stop: 83540 | Risk: $50.00 (1 BTC)</div>
              <div className="text-slate-300">Distance: $260.00</div>
              <div className="text-slate-300">Theoretical: 0.192307 lots</div>
              <div className="text-emerald-400 font-bold">Permitted: 0.19 lots | Risk: $49.40</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-2">
          <Link to="/calculator">
            <Button variant="primary" size="lg" leftIcon={<Calculator className="w-5 h-5" />}>
              Test Calculations in Live Calculator
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};
