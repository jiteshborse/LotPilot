import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { CalculatorForm } from '../components/calculator/CalculatorForm';
import { ASSET_CLASSES } from '../data/asset-classes';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
  Calculator,
  Sparkles,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const scrollToCalculator = () => {
    const el = document.getElementById('calculator-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 py-6 md:py-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <Container size="xl">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Know Your Risk. Calculate Your Size. Trade With a Plan.</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Calculate Your Position Size.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-300 to-emerald-400">
                Control Your Risk.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              An all-in-one institutional-grade position-size calculator for forex, gold, silver, crypto, indices, US stocks, and Indian markets.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={scrollToCalculator}
                leftIcon={<Calculator className="w-5 h-5" />}
              >
                Calculate Position Size
              </Button>

              <Link to="/markets">
                <Button variant="secondary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore Supported Markets
                </Button>
              </Link>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>10+ Asset Classes</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Strict Decimal.js Floor Rounding</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Multi-Currency Conversion</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-indigo-400" />
                <span>No Brokerage Credentials</span>
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Interactive Working Calculator Section */}
      <section id="calculator-section" className="scroll-mt-20">
        <Container size="xl">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Calculator className="w-6 h-6 text-indigo-400" />
                  <span>Interactive Risk & Position Calculator</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time financial calculation engine with zero silent approximations.
                </p>
              </div>

              <Badge variant="emerald" size="md" dot>
                Engine Active & Validated
              </Badge>
            </div>

            {/* Complete interactive working calculator */}
            <CalculatorForm />
          </div>
        </Container>
      </section>

      {/* Supported Markets Grid */}
      <section className="py-6">
        <Container size="xl">
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Supported Financial Markets
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Each market is evaluated with its authentic contract multiplier, tick size, and currency conversion path.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ASSET_CLASSES.slice(0, 8).map((ac) => (
                <div
                  key={ac.id}
                  className="p-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl hover:border-indigo-500/50 transition-all space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                      {ac.shortName}
                    </span>
                    <Badge variant={ac.badgeColor as any} size="sm">
                      {ac.defaultUnit}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {ac.name}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {ac.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/60 flex flex-wrap gap-1 text-[11px] font-mono text-slate-300">
                    {ac.examples.map((ex, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <Link to="/markets">
                <Button variant="secondary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  View Full Specifications & Guides in Markets Directory
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-8 bg-slate-950/60 border-y border-slate-800/80">
        <Container size="xl">
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Transparent Workflow
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                How Position Sizing Works in 3 Steps
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold font-mono text-base">
                  1
                </div>
                <h3 className="text-base font-semibold text-white">
                  Select Instrument & Account Currency
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Choose from Forex, Metals, Crypto, US/Indian Stocks, Futures, or Options. The system identifies contract size, pip size, tick value, and your account conversion route.
                </p>
              </div>

              <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold font-mono text-base">
                  2
                </div>
                <h3 className="text-base font-semibold text-white">
                  Enter Entry, Stop Loss & Risk Budget
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Specify your exact stop-loss level and risk tolerance (fixed cash amount or percentage of account equity). Direction rules are validated instantly to prevent conflicting stops.
                </p>
              </div>

              <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold font-mono text-base">
                  3
                </div>
                <h3 className="text-base font-semibold text-white">
                  Review Size, Risk & Mathematical Proof
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Receive the recommended position quantity rounded down strictly to broker increments. Review gross and all-in risk, margin estimate, and collapsible step-by-step mathematical proof.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Why LotPilot / Value Propositions */}
      <section className="py-6">
        <Container size="xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Institutional Quantitative Precision
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Why Professional Traders Use LotPilot
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Most web calculators use a generic single-formula floating point approach that produces dangerous position rounding errors, ignores broker contract specifications, or hallucinates live rates.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block">Strict Floor Rounding Invariant:</strong>
                    <span className="text-slate-400">
                      Calculated quantities are floored to your broker's permitted increment. Your modelled loss will never exceed your requested risk budget under calculation assumptions.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block">Broker-Aware Contract Specifications:</strong>
                    <span className="text-slate-400">
                      Never assume every broker uses 100 oz for gold or 1 BTC per contract. Inspect and customize contract multipliers, tick values, spreads, and commissions.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block">Multi-Currency Arbitrage Safety:</strong>
                    <span className="text-slate-400">
                      Trade non-USD pairs (e.g. USDCHF, EURJPY, RELIANCE) with any account currency (USD, EUR, GBP, INR). Conversion paths are transparently displayed.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <span>Tested Regression Benchmark Cases</span>
              </h3>
              <p className="text-xs text-slate-400">
                LotPilot's financial arithmetic engine is continuously verified against exact analytical benchmarks:
              </p>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="text-indigo-400 font-bold">EURUSD Short</span>
                    <span className="text-slate-400 block text-[11px]">5.6 pips @ $20 risk</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-bold">0.35 lots</span>
                    <span className="text-emerald-400 block text-[11px]">$19.60 risk</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="text-indigo-400 font-bold">XAUUSD Short</span>
                    <span className="text-slate-400 block text-[11px]">$7 stop @ $20 risk (0.001 step)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-bold">0.028 lots</span>
                    <span className="text-emerald-400 block text-[11px]">$19.60 risk</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="text-indigo-400 font-bold">BTCUSD Short</span>
                    <span className="text-slate-400 block text-[11px]">$260 stop @ $50 risk</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-bold">0.19 lots</span>
                    <span className="text-emerald-400 block text-[11px]">$49.40 risk</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="text-indigo-400 font-bold">NIFTY 50 Futures</span>
                    <span className="text-slate-400 block text-[11px]">50 pts stop @ ₹3000 (25 lot step)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-bold">50 shares (2 lots)</span>
                    <span className="text-emerald-400 block text-[11px]">₹2500 risk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-10">
        <Container size="xl">
          <div className="p-8 md:p-12 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl text-center space-y-4 shadow-2xl relative overflow-hidden">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Ready to Size Your Trades With Confidence?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Open the dedicated Pro Calculator workstation with multi-trade staging, calculation history, and custom contract specifications.
            </p>
            <div className="pt-2">
              <Link to="/calculator">
                <Button variant="primary" size="lg" leftIcon={<Calculator className="w-5 h-5" />}>
                  Open Pro Calculator Workstation
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};
