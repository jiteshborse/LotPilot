import React, { useState } from 'react';
import { InstrumentSpecification, AssetClass } from '../../lib/calculations/types';
import { Badge } from '../ui/Badge';
import { Search, SlidersHorizontal, PlusCircle } from 'lucide-react';

interface InstrumentSelectorProps {
  instruments: InstrumentSpecification[];
  selectedInstrument: InstrumentSpecification;
  selectedAssetClass: AssetClass;
  onSelectInstrument: (instrument: InstrumentSpecification) => void;
  onOpenSpecsModal: () => void;
  onOpenNewCustomModal: () => void;
}

export const InstrumentSelector: React.FC<InstrumentSelectorProps> = ({
  instruments,
  selectedInstrument,
  selectedAssetClass,
  onSelectInstrument,
  onOpenSpecsModal,
  onOpenNewCustomModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter instruments matching current asset class (or all if custom) and search query
  const filteredInstruments = instruments.filter((inst) => {
    const matchesClass = inst.assetClass === selectedAssetClass;
    const matchesSearch =
      inst.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div className="w-full space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          2. Select Instrument
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSpecsModal}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Edit Specifications</span>
          </button>
          <span className="text-slate-600">|</span>
          <button
            type="button"
            onClick={onOpenNewCustomModal}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
          >
            <PlusCircle className="w-3 h-3" />
            <span>Custom</span>
          </button>
        </div>
      </div>

      {/* Search and Dropdown Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search symbol (e.g. EURUSD, XAU, BTC, NIFTY)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <select
            value={selectedInstrument.id}
            onChange={(e) => {
              const found = instruments.find((i) => i.id === e.target.value);
              if (found) onSelectInstrument(found);
            }}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg text-xs font-medium text-slate-100 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            {filteredInstruments.length > 0 ? (
              filteredInstruments.map((inst) => (
                <option key={inst.id} value={inst.id} className="bg-slate-900 text-slate-100 py-1">
                  {inst.symbol} — {inst.displayName}
                </option>
              ))
            ) : (
              <option disabled value="">
                No matching instruments found in this category
              </option>
            )}
          </select>
        </div>
      </div>

      {/* Active Instrument Specification Badge Bar */}
      <div className="p-2.5 bg-slate-950/40 border border-slate-800/60 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-white tracking-wide">
            {selectedInstrument.symbol}
          </span>
          <Badge
            variant={
              selectedInstrument.specificationSource === 'verified_exchange'
                ? 'emerald'
                : selectedInstrument.specificationSource === 'verified_broker'
                ? 'blue'
                : selectedInstrument.specificationSource === 'user_configured'
                ? 'purple'
                : 'amber'
            }
            size="sm"
          >
            {selectedInstrument.specificationSource === 'verified_exchange'
              ? 'Exchange Verified'
              : selectedInstrument.specificationSource === 'verified_broker'
              ? 'Broker Verified'
              : selectedInstrument.specificationSource === 'user_configured'
              ? 'User Configured'
              : 'Illustrative Example'}
          </Badge>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">
            Contract: <strong className="text-slate-200 font-mono">{selectedInstrument.contractSize.toLocaleString()}</strong>
          </span>
          {selectedInstrument.pipSize && (
            <>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">
                Pip: <strong className="text-slate-200 font-mono">{selectedInstrument.pipSize}</strong>
              </span>
            </>
          )}
          {selectedInstrument.exchangeLotSize && (
            <>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">
                Lot Bundle: <strong className="text-emerald-400 font-mono">{selectedInstrument.exchangeLotSize}</strong>
              </span>
            </>
          )}
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">
            Step: <strong className="text-slate-200 font-mono">{selectedInstrument.quantityStep}</strong>
          </span>
        </div>

        <div className="text-[11px] text-slate-400">
          Quote / Profit: <span className="font-mono text-slate-200">{selectedInstrument.profitCurrency}</span>
        </div>
      </div>
    </div>
  );
};
