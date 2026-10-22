import React, { useState } from 'react';
import { HistoryItem, PersistenceManager } from '../../lib/persistence/storage';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Download, Trash2, Clock, Copy, Check, AlertTriangle } from 'lucide-react';

interface CalculationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onDeleteHistoryItem: (id: string) => void;
  onClearAllHistory: () => void;
}

export const CalculationHistoryModal: React.FC<CalculationHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onDeleteHistoryItem,
  onClearAllHistory,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleExportCsv = () => {
    const csvContent = PersistenceManager.exportHistoryToCsv();
    if (!csvContent) return;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `lotpilot_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyItem = async (item: HistoryItem) => {
    const r = item.result;
    const text = `${r.instrumentSymbol} ${r.direction.toUpperCase()} | Entry: ${r.entryPrice} | Stop: ${r.stopLossPrice} (${r.stopLossDistanceDisplay}) | Size: ${r.permittedQuantity} ${r.quantityUnit} | Risk: ${r.accountCurrency} ${r.grossEstimatedRisk}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Calculation History"
      description="Persistent browser-stored calculations and risk records."
      maxWidth="4xl"
    >
      <div className="space-y-4 text-xs">
        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>
              Total Saved Entries: <strong className="text-white">{history.length}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={history.length === 0}
              onClick={handleExportCsv}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export CSV
            </Button>

            {history.length > 0 && !showConfirmClear && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirmClear(true)}
                className="text-rose-400 hover:text-rose-300 hover:border-rose-800"
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Clear Confirmation Prompt */}
        {showConfirmClear && (
          <div className="p-3 bg-rose-950/30 border border-rose-800/60 rounded-xl flex items-center justify-between gap-3 text-rose-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Are you sure you want to permanently delete all {history.length} history records?</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  onClearAllHistory();
                  setShowConfirmClear(false);
                }}
              >
                Yes, Delete All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirmClear(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* History Records Table / Cards */}
        {history.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl space-y-2 text-slate-500">
            <Clock className="w-8 h-8 mx-auto opacity-40" />
            <p>No calculations saved yet.</p>
            <p className="text-[11px]">
              Click "Save History" on any calculation result to store it locally for your records.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {history.map((item) => {
              const r = item.result;
              return (
                <div
                  key={item.id}
                  className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl flex flex-wrap items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{r.instrumentSymbol}</span>
                      <Badge
                        variant={r.direction === 'long' ? 'emerald' : 'rose'}
                        size="sm"
                      >
                        {r.direction.toUpperCase()}
                      </Badge>
                      <Badge variant="slate" size="sm">
                        {r.assetClass}
                      </Badge>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono">
                      Entry: <span className="text-slate-200">{r.entryPrice}</span> • Stop:{' '}
                      <span className="text-slate-200">{r.stopLossPrice}</span> (
                      {r.stopLossDistanceDisplay})
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Position Size</span>
                      <span className="font-mono font-bold text-indigo-400 text-sm">
                        {r.permittedQuantity} {r.quantityUnit}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Gross Risk</span>
                      <span className="font-mono font-bold text-white">
                        {r.accountCurrency} {r.grossEstimatedRisk}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyItem(item)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Copy summary"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => onDeleteHistoryItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
