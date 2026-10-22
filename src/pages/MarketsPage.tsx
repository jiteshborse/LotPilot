import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { DEFAULT_INSTRUMENTS } from '../data/default-instruments';
import { ASSET_CLASSES } from '../data/asset-classes';
import { InstrumentSpecification } from '../lib/calculations/types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  Globe2,
  Search,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

export const MarketsPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');

  const filtered = DEFAULT_INSTRUMENTS.filter((inst) => {
    const matchesClass = selectedClass === 'all' || inst.assetClass === selectedClass;
    const matchesSearch =
      inst.symbol.toLowerCase().includes(search.toLowerCase()) ||
      inst.displayName.toLowerCase().includes(search.toLowerCase()) ||
      inst.assetClass.toLowerCase().includes(search.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const handleLoadInstrument = (_inst: InstrumentSpecification) => {
    // Navigate to calculator
    navigate('/calculator');
  };

  return (
    <div className="py-6 space-y-8">
      <Container size="xl">
        {/* Header */}
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Globe2 className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Supported Markets & Specifications Guide
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            LotPilot supports 10+ financial market segments. Review exact contract sizes, tick values, and trading increments below. Every instrument specification is fully customizable.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search symbol, market name, or asset class (e.g. XAUUSD, NIFTY, ES)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="all">All Asset Classes ({DEFAULT_INSTRUMENTS.length})</option>
                {ASSET_CLASSES.map((ac) => (
                  <option key={ac.id} value={ac.id}>
                    {ac.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <span className="text-slate-500 text-[11px]">Quick filters:</span>
            <button
              onClick={() => setSelectedClass('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors cursor-pointer ${
                selectedClass === 'all'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              All ({DEFAULT_INSTRUMENTS.length})
            </button>
            {ASSET_CLASSES.slice(0, 7).map((ac) => (
              <button
                key={ac.id}
                onClick={() => setSelectedClass(ac.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors cursor-pointer ${
                  selectedClass === ac.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                {ac.shortName}
              </button>
            ))}
          </div>
        </div>

        {/* Specifications Table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Symbol / Name</th>
                  <th className="py-3 px-3">Asset Class</th>
                  <th className="py-3 px-3">Contract Size</th>
                  <th className="py-3 px-3">Pip / Tick Size</th>
                  <th className="py-3 px-3">Tick / Point Value</th>
                  <th className="py-3 px-3">Step Increment</th>
                  <th className="py-3 px-3">Currencies</th>
                  <th className="py-3 px-3">Source Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {filtered.map((inst) => (
                  <tr key={inst.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-sans font-bold text-white text-sm">
                        {inst.symbol}
                      </div>
                      <div className="font-sans text-[11px] text-slate-400">
                        {inst.displayName}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-sans">
                      <Badge variant="slate" size="sm">
                        {inst.assetClass}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-3">
                      <strong className="text-white">
                        {inst.contractSize.toLocaleString()}
                      </strong>{' '}
                      <span className="text-[11px] text-slate-500 font-sans">
                        {inst.contractMultiplier ? `(×${inst.contractMultiplier})` : 'units'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      {inst.pipSize ? (
                        <div>
                          Pip: <strong className="text-indigo-300">{inst.pipSize}</strong>
                        </div>
                      ) : (
                        <div>
                          Tick: <strong className="text-slate-200">{inst.tickSize}</strong>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      {inst.valuePerPoint ? (
                        <span>${inst.valuePerPoint}/pt</span>
                      ) : inst.tickValue ? (
                        <span>
                          {inst.tickValueCurrency || inst.profitCurrency} {inst.tickValue}
                        </span>
                      ) : (
                        <span className="text-slate-500">Linear</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      {inst.exchangeLotSize ? (
                        <span className="text-emerald-400 font-bold">
                          {inst.exchangeLotSize} bundle
                        </span>
                      ) : (
                        <span>{inst.quantityStep}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-[11px]">
                      <div>Quote: {inst.quoteCurrency}</div>
                      <div className="text-slate-400">Profit: {inst.profitCurrency}</div>
                    </td>

                    <td className="py-3.5 px-3 font-sans">
                      <Badge
                        variant={
                          inst.specificationSource === 'verified_exchange'
                            ? 'emerald'
                            : inst.specificationSource === 'verified_broker'
                            ? 'blue'
                            : 'amber'
                        }
                        size="sm"
                      >
                        {inst.specificationSource === 'verified_exchange'
                          ? 'Exchange'
                          : inst.specificationSource === 'verified_broker'
                          ? 'Broker'
                          : 'Example'}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right font-sans">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleLoadInstrument(inst)}
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Size Trade
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Broker Variability Advisory */}
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3 text-xs leading-relaxed">
          <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Why Contract Specifications Vary Between Brokers</span>
          </div>
          <p className="text-slate-300">
            Unlike centralized stock exchanges where 1 share is always 1 share, OTC derivatives and CFDs vary dramatically between brokers:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
            <li>
              <strong>Gold (XAUUSD):</strong> While institutional standard lots represent 100 troy ounces, some CFD brokers define a lot as 10 ounces or 1 ounce. Sizing with an assumed 100 oz contract on a 10 oz broker would trade 10x smaller than intended, while the reverse could cause fatal liquidation.
            </li>
            <li>
              <strong>Indices (US500, US100):</strong> Some brokers quote $1 per index point, while others quote $10, $20, or $50 per lot. Always check your broker’s contract specification window before trading.
            </li>
            <li>
              <strong>Crypto Perpetuals:</strong> USDT-margined perpetuals are linear ($1 move = $1 profit per coin), whereas inverse perpetuals are margined in BTC/ETH with non-linear payoffs.
            </li>
          </ul>
        </div>
      </Container>
    </div>
  );
};
