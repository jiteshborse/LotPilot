import React from 'react';
import { StagedTrade } from '../../lib/persistence/storage';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Trash2, AlertCircle, TrendingUp, TrendingDown, Layers } from 'lucide-react';
import Decimal from 'decimal.js';

interface MultiTradePlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stagedTrades: StagedTrade[];
  onRemoveTrade: (id: string) => void;
  onClearAllTrades: () => void;
  accountCurrency: string;
}

export const MultiTradePlannerModal: React.FC<MultiTradePlannerModalProps> = ({
  isOpen,
  onClose,
  stagedTrades,
  onRemoveTrade,
  onClearAllTrades,
  accountCurrency,
}) => {
  // Aggregate planned risk
  const totalPlannedRisk = stagedTrades.reduce((acc, t) => {
    try {
      return acc.add(new Decimal(t.grossEstimatedRisk));
    } catch {
      return acc;
    }
  }, new Decimal(0));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Multi-Trade Risk Planner"
      description="Stage multiple planned positions and inspect aggregate trade risk before executing."
      maxWidth="2xl"
    >
      <div className="space-y-4 text-xs">
        {/* Total Planned Risk Summary Card */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
              Total Planned Stop-Loss Risk ({stagedTrades.length} Trades)
            </span>
            <div className="text-2xl font-bold font-mono text-white mt-0.5">
              {accountCurrency} {totalPlannedRisk.toFixed(2)}
            </div>
          </div>
          {stagedTrades.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAllTrades}
              className="text-rose-400 hover:text-rose-300 hover:border-rose-800"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Portfolio Correlation Disclaimer Alert */}
        <div className="p-3 bg-indigo-950/20 border border-indigo-800/40 rounded-xl flex items-start gap-2.5 text-indigo-300">
          <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Important Risk Model Notice:</strong> This summary represents the sum of individual planned stop-loss risks. It does <em>not</em> model cross-market covariance, asset correlation, or portfolio-level Value at Risk (VaR). Simultaneous stops may trigger in correlated market shocks.
          </p>
        </div>

        {/* Staged Trades List */}
        {stagedTrades.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl space-y-2 text-slate-500">
            <Layers className="w-8 h-8 mx-auto opacity-50" />
            <p>No trades staged yet.</p>
            <p className="text-[11px]">
              Use the "Stage in Planner" button on any calculated position size to add it here.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
            {stagedTrades.map((trade) => (
              <div
                key={trade.id}
                className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl flex flex-wrap items-center justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      trade.direction === 'long'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                        : 'bg-rose-950 text-rose-400 border border-rose-800/60'
                    }`}
                  >
                    {trade.direction === 'long' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{trade.symbol}</span>
                      <Badge
                        variant={trade.direction === 'long' ? 'emerald' : 'rose'}
                        size="sm"
                      >
                        {trade.direction.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Entry: {trade.entryPrice} • Stop: {trade.stopLossPrice}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Position Size</span>
                    <span className="font-mono font-bold text-slate-200">
                      {trade.permittedQuantity} {trade.quantityUnit}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Planned Risk</span>
                    <span className="font-mono font-bold text-white">
                      {trade.accountCurrency} {trade.grossEstimatedRisk}
                    </span>
                  </div>

                  <button
                    onClick={() => onRemoveTrade(trade.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Remove staged trade"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Planner
          </Button>
        </div>
      </div>
    </Modal>
  );
};
