import React from 'react';
import { InstrumentSpecification, TradeDirection } from '../../lib/calculations/types';
import { Input } from '../ui/Input';
import Decimal from 'decimal.js';
import { Target, AlertCircle } from 'lucide-react';

interface PriceInputsProps {
  instrument: InstrumentSpecification;
  direction: TradeDirection;
  entryPrice: string | number;
  onEntryPriceChange: (val: string) => void;
  stopLossPrice: string | number;
  onStopLossPriceChange: (val: string) => void;
  takeProfitPrice: string | number;
  onTakeProfitPriceChange: (val: string) => void;
  priceError?: string;
}

export const PriceInputs: React.FC<PriceInputsProps> = ({
  instrument,
  direction,
  entryPrice,
  onEntryPriceChange,
  stopLossPrice,
  onStopLossPriceChange,
  takeProfitPrice,
  onTakeProfitPriceChange,
  priceError,
}) => {
  // Compute live distance metrics
  let distanceDisplay = '';
  let distancePercent = '';
  let isValidDistance = false;

  try {
    if (entryPrice && stopLossPrice) {
      const entry = new Decimal(entryPrice);
      const stop = new Decimal(stopLossPrice);
      if (entry.gt(0) && stop.gt(0)) {
        const diff = entry.sub(stop).abs();
        const pct = diff.div(entry).mul(100);
        distancePercent = `${pct.toFixed(2)}%`;

        if (instrument.assetClass === 'forex' && instrument.pipSize) {
          const pips = diff.div(new Decimal(instrument.pipSize));
          distanceDisplay = `${pips.toFixed(1)} pips (${diff.toString()})`;
        } else if (instrument.payoffModel === 'point_value' && instrument.valuePerPoint) {
          distanceDisplay = `${diff.toFixed(2)} points`;
        } else if (instrument.tickSize && instrument.tickValue) {
          const ticks = diff.div(new Decimal(instrument.tickSize));
          distanceDisplay = `${ticks.toFixed(0)} ticks (${diff.toString()})`;
        } else {
          distanceDisplay = `${diff.toString()} ${instrument.quoteCurrency}`;
        }

        // Check direction validity
        if (direction === 'long' && stop.lt(entry)) isValidDistance = true;
        if (direction === 'short' && stop.gt(entry)) isValidDistance = true;
      }
    }
  } catch {
    distanceDisplay = '';
  }

  // Quick R:R TP setter
  const applyRewardRatio = (ratio: number) => {
    try {
      if (!entryPrice || !stopLossPrice) return;
      const entry = new Decimal(entryPrice);
      const stop = new Decimal(stopLossPrice);
      if (entry.lte(0) || stop.lte(0)) return;

      const stopDist = entry.sub(stop).abs();
      const targetDist = stopDist.mul(ratio);

      let targetPrice: Decimal;
      if (direction === 'long') {
        targetPrice = entry.add(targetDist);
      } else {
        targetPrice = entry.sub(targetDist);
      }

      if (targetPrice.gt(0)) {
        // Format with appropriate decimal precision based on tickSize
        const tickStr = instrument.tickSize ? instrument.tickSize.toString() : '0.01';
        const decimals = tickStr.includes('.') ? tickStr.split('.')[1].length : 2;
        onTakeProfitPriceChange(targetPrice.toFixed(decimals));
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full space-y-3 p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl">
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
        <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider block">
          5. Trade Entry & Stop-Loss Levels
        </label>
        <span className="text-[11px] font-mono text-slate-400">
          Units: {instrument.quoteCurrency}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Entry Price"
          type="number"
          step="any"
          value={entryPrice}
          onChange={(e) => onEntryPriceChange(e.target.value)}
          placeholder={
            instrument.assetClass === 'forex'
              ? 'e.g. 1.13530'
              : instrument.assetClass === 'precious_metals'
              ? 'e.g. 4164.00'
              : 'e.g. 100.00'
          }
          leftAddon={instrument.quoteCurrency}
        />

        <Input
          label={`Stop-Loss Price (${direction === 'long' ? 'Must be below' : 'Must be above'})`}
          type="number"
          step="any"
          value={stopLossPrice}
          onChange={(e) => onStopLossPriceChange(e.target.value)}
          placeholder={
            instrument.assetClass === 'forex'
              ? 'e.g. 1.13586'
              : instrument.assetClass === 'precious_metals'
              ? 'e.g. 4171.00'
              : 'e.g. 98.00'
          }
          leftAddon={instrument.quoteCurrency}
          error={priceError}
        />
      </div>

      {/* Live Stop Distance Indicator */}
      {distanceDisplay && (
        <div
          className={`p-2.5 rounded-lg border flex flex-wrap items-center justify-between gap-2 text-xs transition-colors ${
            isValidDistance
              ? 'bg-slate-950/70 border-slate-800 text-slate-300'
              : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-1.5">
            {!isValidDistance && <AlertCircle className="w-3.5 h-3.5 text-rose-400" />}
            <span>Stop Distance:</span>
            <strong className="font-mono text-white text-sm">{distanceDisplay}</strong>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            Price Move: <span className="text-indigo-300 font-semibold">{distancePercent}</span>
          </div>
        </div>
      )}

      {/* Optional Take Profit Price */}
      <div className="pt-2 border-t border-slate-800/60 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-medium text-slate-300">
              Optional Take-Profit Target (Risk/Reward)
            </span>
          </div>

          {/* Quick R:R Auto-Calculator buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500">Auto Target:</span>
            {[1, 2, 3].map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => applyRewardRatio(ratio)}
                className="px-2 py-0.5 text-[11px] font-mono font-medium bg-slate-950 border border-slate-800 hover:border-indigo-500 text-slate-300 hover:text-white rounded transition-colors cursor-pointer"
              >
                1:{ratio}
              </button>
            ))}
          </div>
        </div>

        <Input
          type="number"
          step="any"
          value={takeProfitPrice}
          onChange={(e) => onTakeProfitPriceChange(e.target.value)}
          placeholder="Enter target price to compute R:R ratio..."
          leftAddon={instrument.quoteCurrency}
        />
      </div>
    </div>
  );
};
