import React, { useState } from 'react';
import { CalculationResult } from '../../lib/calculations/types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Copy,
  Check,
  BookmarkPlus,
  RotateCcw,
  ListPlus,
  AlertTriangle,
  Info,
  Layers,
} from 'lucide-react';

interface ResultsPanelProps {
  result: CalculationResult | null;
  onReset: () => void;
  onSaveHistory: (result: CalculationResult) => void;
  onStageTrade: (result: CalculationResult) => void;
  onOpenSpecsModal?: () => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  result,
  onReset,
  onSaveHistory,
  onStageTrade,
  onOpenSpecsModal: _onOpenSpecsModal,
}) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [staged, setStaged] = useState(false);

  if (!result || !result.isValid) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-900/40 border border-slate-800/80 rounded-2xl text-center space-y-4 min-h-[420px]">
        <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-500">
          <Layers className="w-8 h-8" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <h4 className="text-base font-semibold text-slate-300">
            Awaiting Calculation Inputs
          </h4>
          <p className="text-xs text-slate-500">
            Select an instrument, set your risk budget, and enter valid entry and stop-loss levels to calculate permitted position size.
          </p>
        </div>
      </div>
    );
  }

  // Handle copy summary
  const handleCopySummary = async () => {
    const text = [
      `LotPilot Calculation Summary:`,
      `Instrument: ${result.instrumentSymbol} (${result.assetClass})`,
      `Direction: ${result.direction.toUpperCase()}`,
      `Entry: ${result.entryPrice} | Stop Loss: ${result.stopLossPrice}`,
      `Stop Distance: ${result.stopLossDistanceDisplay}`,
      `Recommended Position Size: ${result.permittedQuantity} ${result.quantityUnit}`,
      `Theoretical Size: ${result.theoreticalQuantity} ${result.quantityUnit}`,
      `Estimated Gross Risk: ${result.accountCurrency} ${result.grossEstimatedRisk}`,
      `Risk Budget: ${result.accountCurrency} ${result.riskBudget} (${result.riskBudgetUsagePercent}% utilized)`,
      `Notional Exposure: ${result.accountCurrency} ${result.notionalExposure}`,
      `Margin Estimate: ${result.accountCurrency} ${result.estimatedMargin}`,
      result.rewardToRisk ? `Reward-to-Risk: ${result.rewardToRisk.rewardToRiskRatio} (Gross Reward: ${result.accountCurrency} ${result.rewardToRisk.potentialGrossReward})` : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleSave = () => {
    onSaveHistory(result);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleStage = () => {
    onStageTrade(result);
    setStaged(true);
    setTimeout(() => setStaged(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Primary Recommended Size Card */}
      <div className="p-6 bg-gradient-to-br from-indigo-950/60 via-slate-900/90 to-slate-950 border border-indigo-500/30 rounded-2xl shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Layers className="w-32 h-32 text-indigo-400" />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider uppercase text-indigo-300">
            Recommended Position Size
          </span>
          <Badge variant="indigo" size="sm">
            Strict Floor Rounding
          </Badge>
        </div>

        {/* Big Bold Quantity Display */}
        <div className="flex items-baseline gap-2.5">
          <span className="text-4xl md:text-5xl font-extrabold font-mono text-white tracking-tight">
            {result.permittedQuantity}
          </span>
          <span className="text-lg md:text-xl font-medium text-slate-300">
            {result.quantityUnit}
          </span>
        </div>

        {/* Comparison: Theoretical vs Permitted */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-400 block">Theoretical Size:</span>
            <span className="font-mono text-slate-200 font-medium">
              {result.theoreticalQuantity} {result.quantityUnit}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Permitted Increment:</span>
            <span className="font-mono text-slate-200 font-medium">
              {result.stepIncrement} {result.quantityUnit}
            </span>
          </div>
        </div>

        {/* Estimated Risk vs Risk Budget */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Estimated Gross Stop Risk:</span>
            <span className="font-mono font-bold text-white text-sm">
              {result.accountCurrency} {result.grossEstimatedRisk}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span>Requested Risk Budget:</span>
            <span className="font-mono text-slate-300">
              {result.accountCurrency} {result.riskBudget}
            </span>
          </div>

          {/* Budget Usage Bar */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Risk Budget Usage</span>
              <span className="font-mono text-indigo-300 font-semibold">
                {result.riskBudgetUsagePercent}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Number(result.riskBudgetUsagePercent))}%` }}
              />
            </div>
          </div>
        </div>

        {/* All-in risk if costs configured */}
        {Number(result.allInEstimatedRisk) > Number(result.grossEstimatedRisk) && (
          <div className="flex items-center justify-between text-xs p-2.5 bg-amber-950/30 border border-amber-800/40 rounded-lg text-amber-200">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>All-In Risk (incl. Spread/Commission/Slippage):</span>
            </div>
            <span className="font-mono font-bold">
              {result.accountCurrency} {result.allInEstimatedRisk}
            </span>
          </div>
        )}
      </div>

      {/* Financial Exposure & Trade Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
        <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-1">
          <span className="text-slate-400 block text-[11px]">Stop Distance</span>
          <span className="font-mono font-semibold text-white block">
            {result.stopLossDistanceDisplay}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {result.stopLossPercentage}% move
          </span>
        </div>

        <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-1">
          <span className="text-slate-400 block text-[11px]">Notional Exposure</span>
          <span className="font-mono font-semibold text-white block">
            {result.accountCurrency} {result.notionalExposure}
          </span>
          <span className="text-[10px] text-slate-500">Total trade value</span>
        </div>

        <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-1">
          <span className="text-slate-400 block text-[11px]">Initial Margin</span>
          <span className="font-mono font-semibold text-white block">
            {result.estimatedMargin !== 'N/A'
              ? `${result.accountCurrency} ${result.estimatedMargin}`
              : 'N/A'}
          </span>
          <span className="text-[10px] text-slate-500">Broker requirement</span>
        </div>
      </div>

      {/* Optional Take Profit / Reward Details */}
      {result.rewardToRisk && (
        <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
              <span>Take-Profit Target Scenario</span>
            </span>
            <Badge variant="emerald" size="sm">
              R:R {result.rewardToRisk.rewardToRiskRatio}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <span className="text-slate-400 block text-[11px]">Potential Gross Reward:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                +{result.accountCurrency} {result.rewardToRisk.potentialGrossReward}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Target Distance:</span>
              <span className="font-mono text-slate-200">
                {result.rewardToRisk.targetDistanceDisplay}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Warnings & Diagnostics Banner */}
      {result.warnings.length > 0 && (
        <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-xl space-y-1.5 text-xs text-amber-300">
          <div className="flex items-center gap-1.5 font-semibold text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Assumptions & Trade Considerations</span>
          </div>
          <ul className="list-disc pl-4 space-y-1 text-amber-200/90 text-[11px]">
            {result.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopySummary}
          leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleSave}
          leftIcon={saved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
        >
          {saved ? 'Saved' : 'Save History'}
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleStage}
          leftIcon={staged ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ListPlus className="w-3.5 h-3.5" />}
        >
          {staged ? 'Staged' : 'Stage in Planner'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};
