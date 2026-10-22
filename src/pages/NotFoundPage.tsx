import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import { Compass, Home, Calculator } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-20 text-center">
      <Container size="sm">
        <div className="p-8 md:p-12 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-4xl font-extrabold font-mono text-indigo-400">404</span>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              The requested trading route or market page does not exist. Check your URL or return to the calculator.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/">
              <Button variant="secondary" size="md" leftIcon={<Home className="w-4 h-4" />}>
                Return Home
              </Button>
            </Link>

            <Link to="/calculator">
              <Button variant="primary" size="md" leftIcon={<Calculator className="w-4 h-4" />}>
                Open Calculator
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};
