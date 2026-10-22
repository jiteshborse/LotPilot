import React from 'react';
import { Container } from '../components/layout/Container';
import { CalculatorForm } from '../components/calculator/CalculatorForm';
import { Badge } from '../components/ui/Badge';
import { Calculator, Shield, Cpu, Lock } from 'lucide-react';

export const CalculatorPage: React.FC = () => {
  return (
    <div className="py-6 space-y-6">
      <Container size="xl">
        {/* Workstation Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <Calculator className="w-4 h-4" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Position Size & Risk Calculator
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Institutional-grade multi-asset position sizing workstation with real-time financial arithmetic.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="indigo" size="sm">
              <Cpu className="w-3 h-3 mr-1" />
              Decimal.js Engine
            </Badge>
            <Badge variant="emerald" size="sm">
              <Shield className="w-3 h-3 mr-1" />
              Invariant Protected
            </Badge>
            <Badge variant="slate" size="sm">
              <Lock className="w-3 h-3 mr-1" />
              Local Storage
            </Badge>
          </div>
        </div>

        {/* The Full Calculator Workstation */}
        <div className="pt-2">
          <CalculatorForm />
        </div>
      </Container>
    </div>
  );
};
