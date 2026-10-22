import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from './Container';
import { Compass, ShieldAlert, Lock, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs mt-16">
      <Container size="xl">
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">LotPilot</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Know Your Risk. Calculate Your Size. Trade With a Plan.
            </p>
            <p className="text-[11px] text-slate-500 leading-normal">
              Precision multi-asset position-sizing and trade risk management engine built for modern traders.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero brokerage logins or API keys required</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white">
              Application
            </h5>
            <ul className="space-y-2">
              <li>
                <Link to="/calculator" className="hover:text-white transition-colors">
                  Position Size Calculator
                </Link>
              </li>
              <li>
                <Link to="/markets" className="hover:text-white transition-colors">
                  Supported Markets Directory
                </Link>
              </li>
              <li>
                <Link to="/methodology" className="hover:text-white transition-colors">
                  Financial Calculation Methodology
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Supported Markets */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white">
              Supported Asset Classes
            </h5>
            <ul className="space-y-2 text-[11px]">
              <li>Forex Pairs (Standard, Mini, Micro)</li>
              <li>Precious Metals (Gold XAUUSD, Silver XAGUSD)</li>
              <li>Cryptocurrency (Spot, Linear & Inverse Futures)</li>
              <li>US Indices (S&P 500, Nasdaq-100, Dow CFDs)</li>
              <li>Exchange Futures (CME ES, NQ, CL)</li>
              <li>US Equities & ETFs (Cash Shares)</li>
              <li>Indian Equities & Derivatives (NSE Cash & F&O)</li>
              <li>Options (Premium Delta × Multiplier)</li>
            </ul>
          </div>

          {/* Mathematical Standards */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white">
              System Principles
            </h5>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Strict Decimal.js floor rounding</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Final risk never exceeds budget</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Transparent contract specifications</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Explicit currency conversion paths</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>No fabricated live pricing</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Institutional Risk Disclaimer */}
        <div className="border-t border-slate-800/80 py-6 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
            <ShieldAlert className="w-4 h-4" />
            <span>Comprehensive Trading Risk Disclaimer & Assumptions</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            LotPilot is an analytical calculation and risk management tool designed to model theoretical position sizes based on user-entered values, instrument specifications, and reference conversion rates. Calculated results are estimates and do not guarantee actual execution performance. Realized trading losses may exceed theoretical estimates due to market gaps, execution slippage, bid-ask spread widening, rollover financing costs, commissions, and foreign exchange fluctuations. A stop-loss order does not ensure execution at the exact stipulated price in fast-moving, illiquid, or volatile markets.
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            LotPilot does not provide financial advice, trading recommendations, or buy/sell signals. Users are solely responsible for verifying contract multipliers, tick sizes, minimum lot increments, and margin requirements with their respective brokers and exchanges before entering live trades.
          </p>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-slate-800/80 py-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} LotPilot. All calculations local to your browser.
          </div>
          <div className="flex items-center gap-4">
            <span>Client-side Storage v1.0</span>
            <span>•</span>
            <span>High-Precision Engine</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
