import React from 'react';
import { TradeDirection } from '../../lib/calculations/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TradeDirectionSelectorProps {
  direction: TradeDirection;
  onChange: (direction: TradeDirection) => void;
  directionError?: string;
}

export const TradeDirectionSelector: React.FC<TradeDirectionSelectorProps> = ({
  direction,
  onChange,
  directionError,
}) => {
  return (
    <div className="w-full space-y-1.5">
      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
        3. Trade Direction
      </label>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange('long')}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all duration-150 cursor-pointer ${
            direction === 'long'
              ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-sm shadow-emerald-500/20'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Long / Buy</span>
        </button>

        <button
          type="button"
          onClick={() => onChange('short')}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all duration-150 cursor-pointer ${
            direction === 'short'
              ? 'bg-rose-500/15 border-rose-500 text-rose-400 shadow-sm shadow-rose-500/20'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span>Short / Sell</span>
        </button>
      </div>

      {directionError && (
        <p className="text-xs text-rose-400 font-medium animate-in fade-in">
          {directionError}
        </p>
      )}
    </div>
  );
};
