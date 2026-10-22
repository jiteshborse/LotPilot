import React, { useState, useMemo } from 'react';
import {
  AssetClass,
  TradeDirection,
  RiskMode,
  AccountBaseMode,
  InstrumentSpecification,
  CalculationResult,
} from '../../lib/calculations/types';
import { DEFAULT_INSTRUMENTS } from '../../data/default-instruments';
import { BROKER_PROFILES } from '../../data/broker-profiles';
import { defaultEngine } from '../../lib/calculations/engine';
import { PersistenceManager, HistoryItem, StagedTrade } from '../../lib/persistence/storage';

import { AssetClassSelector } from './AssetClassSelector';
import { InstrumentSelector } from './InstrumentSelector';
import { TradeDirectionSelector } from './TradeDirectionSelector';
import { RiskInput } from './RiskInput';
import { PriceInputs } from './PriceInputs';
import { ResultsPanel } from './ResultsPanel';
import { CalculationBreakdown } from './CalculationBreakdown';
import { InstrumentSpecificationModal } from './InstrumentSpecificationModal';
import { NewCustomInstrumentModal } from './NewCustomInstrumentModal';
import { MultiTradePlannerModal } from './MultiTradePlannerModal';
import { CalculationHistoryModal } from './CalculationHistoryModal';

import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ChevronDown, ChevronUp, History, ListPlus } from 'lucide-react';

export const CalculatorForm: React.FC = () => {
  // Load preferences from persistence
  const initialPrefs = useMemo(() => PersistenceManager.getPreferences(), []);

  // Instruments catalog state (defaults + custom instruments)
  const [instruments, setInstruments] = useState<InstrumentSpecification[]>(() => {
    const custom = PersistenceManager.getCustomInstruments();
    return [...custom, ...DEFAULT_INSTRUMENTS];
  });

  // State: Asset class & Instrument
  const [selectedAssetClass, setSelectedAssetClass] = useState<AssetClass>('forex');
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentSpecification>(() => {
    return DEFAULT_INSTRUMENTS.find((i) => i.symbol === 'EURUSD') || DEFAULT_INSTRUMENTS[0];
  });

  // State: Trade Direction & Prices - Initialized with regression Case A
  const [direction, setDirection] = useState<TradeDirection>('short');
  const [entryPrice, setEntryPrice] = useState<string>('1.13530');
  const [stopLossPrice, setStopLossPrice] = useState<string>('1.13586');
  const [takeProfitPrice, setTakeProfitPrice] = useState<string>('1.13400');

  // State: Risk settings
  const [riskMode, setRiskMode] = useState<RiskMode>(initialPrefs.riskMode);
  const [accountCurrency, setAccountCurrency] = useState<string>(initialPrefs.accountCurrency);
  const [riskCashAmount, setRiskCashAmount] = useState<string>('20');
  const [accountEquity, setAccountEquity] = useState<string>(initialPrefs.defaultAccountEquity.toString());
  const [riskPercentage, setRiskPercentage] = useState<string>(initialPrefs.defaultRiskPct.toString());
  const [accountBaseMode, setAccountBaseMode] = useState<AccountBaseMode>('balance');

  // Advanced Broker & Cost Settings
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedBrokerProfile, setSelectedBrokerProfile] = useState<string>(
    initialPrefs.defaultBrokerProfileId || 'raw-ecn'
  );
  const [spread, setSpread] = useState<string>('');
  const [slippage, setSlippage] = useState<string>('');
  const [commissionPerUnit, setCommissionPerUnit] = useState<string>('');
  const [customExchangeRate, setCustomExchangeRate] = useState<string>('');

  // Modals state
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);
  const [isNewCustomModalOpen, setIsNewCustomModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isPlannerModalOpen, setIsPlannerModalOpen] = useState(false);

  // Local storage history and staged trades state
  const [history, setHistory] = useState<HistoryItem[]>(() => PersistenceManager.getHistory());
  const [stagedTrades, setStagedTrades] = useState<StagedTrade[]>(() => PersistenceManager.getStagedTrades());

  // Handle Asset Class Switch
  const handleSelectAssetClass = (ac: AssetClass) => {
    setSelectedAssetClass(ac);
    const matching = instruments.filter((i) => i.assetClass === ac);
    if (matching.length > 0) {
      setSelectedInstrument(matching[0]);
      setDefaultPricesForInstrument(matching[0]);
    }
  };

  // Helper to set sensible prices for testing matching regression cases
  const setDefaultPricesForInstrument = (spec: InstrumentSpecification) => {
    if (spec.symbol === 'EURUSD') {
      // Case A
      setEntryPrice('1.13530');
      setStopLossPrice('1.13586');
      setTakeProfitPrice('1.13400');
      setDirection('short');
      setRiskCashAmount('20');
      setAccountCurrency('USD');
    } else if (spec.symbol === 'AUDUSD') {
      // Case B
      setEntryPrice('0.70214');
      setStopLossPrice('0.70248');
      setTakeProfitPrice('0.70100');
      setDirection('short');
      setRiskCashAmount('50');
      setAccountCurrency('USD');
    } else if (spec.symbol === 'XAUUSD' || spec.symbol === 'XAUUSD_001') {
      // Case C
      setEntryPrice('4164.00');
      setStopLossPrice('4171.00');
      setTakeProfitPrice('4150.00');
      setDirection('short');
      setRiskCashAmount('20');
      setAccountCurrency('USD');
    } else if (spec.symbol === 'BTCUSD' || spec.symbol === 'BTCUSDT' || spec.symbol === 'BTCUSDT_PERP') {
      // Case D
      setEntryPrice('83280');
      setStopLossPrice('83540');
      setTakeProfitPrice('82500');
      setDirection('short');
      setRiskCashAmount('50');
      setAccountCurrency('USD');
    } else if (spec.symbol === 'USDCHF') {
      // Case E
      setEntryPrice('0.83160');
      setStopLossPrice('0.83240');
      setTakeProfitPrice('0.83000');
      setDirection('short');
      setRiskCashAmount('20');
      setAccountCurrency('USD');
    } else if (spec.symbol === 'US500' || spec.symbol === 'ES') {
      setEntryPrice('5850.00');
      setStopLossPrice('5830.00');
      setTakeProfitPrice('5890.00');
      setDirection('long');
      setRiskCashAmount('100');
      setAccountCurrency('USD');
    } else if (spec.symbol === 'AAPL') {
      setEntryPrice('230.00');
      setStopLossPrice('225.00');
      setTakeProfitPrice('240.00');
      setDirection('long');
      setRiskCashAmount('100');
      setAccountCurrency('USD');
    } else if (spec.symbol === 'RELIANCE') {
      setEntryPrice('2850.00');
      setStopLossPrice('2820.00');
      setTakeProfitPrice('2910.00');
      setDirection('long');
      setRiskCashAmount('1000');
      setAccountCurrency('INR');
    } else if (spec.symbol === 'NIFTY_FUT') {
      setEntryPrice('24500');
      setStopLossPrice('24450');
      setTakeProfitPrice('24600');
      setDirection('long');
      setRiskCashAmount('3000');
      setAccountCurrency('INR');
    }
  };

  // Handle Instrument Switch
  const handleSelectInstrument = (inst: InstrumentSpecification) => {
    setSelectedInstrument(inst);
    setSelectedAssetClass(inst.assetClass);
    setDefaultPricesForInstrument(inst);
  };

  // Handle Broker Profile Switch
  const handleBrokerProfileChange = (profileId: string) => {
    setSelectedBrokerProfile(profileId);
    const profile = BROKER_PROFILES.find((p) => p.id === profileId);
    if (profile) {
      if (profile.defaultCommission) {
        setCommissionPerUnit(profile.defaultCommission.value.toString());
      }
      if (profile.spreadEstimatePips) {
        setSpread(profile.spreadEstimatePips.toString());
      }
      if (profile.slippageEstimatePips) {
        setSlippage(profile.slippageEstimatePips.toString());
      }
    }
  };

  // Save updated instrument specifications
  const handleSaveSpec = (updatedSpec: InstrumentSpecification) => {
    setSelectedInstrument(updatedSpec);
    setInstruments((prev) =>
      prev.map((item) => (item.id === updatedSpec.id ? updatedSpec : item))
    );
    PersistenceManager.saveCustomInstrument(updatedSpec);
  };

  // Reset specification to original default
  const handleResetSpecToDefault = (symbol: string) => {
    const original = DEFAULT_INSTRUMENTS.find((i) => i.symbol === symbol);
    if (original) {
      setSelectedInstrument(original);
      setInstruments((prev) =>
        prev.map((item) => (item.symbol === symbol ? original : item))
      );
      PersistenceManager.deleteCustomInstrument(original.id);
    }
  };

  // Add new custom instrument
  const handleAddCustomInstrument = (newSpec: InstrumentSpecification) => {
    setInstruments((prev) => [newSpec, ...prev]);
    setSelectedInstrument(newSpec);
    setSelectedAssetClass(newSpec.assetClass);
    PersistenceManager.saveCustomInstrument(newSpec);
  };

  // Live Calculation Trigger
  const calculationResult: CalculationResult = useMemo(() => {
    return defaultEngine.calculate({
      instrument: selectedInstrument,
      direction,
      entryPrice,
      stopLossPrice,
      takeProfitPrice,
      riskMode,
      riskCashAmount,
      accountEquity,
      riskPercentage,
      accountCurrency,
      customExchangeRate: customExchangeRate ? Number(customExchangeRate) : undefined,
      spread: spread ? Number(spread) : undefined,
      slippage: slippage ? Number(slippage) : undefined,
      commissionPerUnit: commissionPerUnit ? Number(commissionPerUnit) : undefined,
    });
  }, [
    selectedInstrument,
    direction,
    entryPrice,
    stopLossPrice,
    takeProfitPrice,
    riskMode,
    riskCashAmount,
    accountEquity,
    riskPercentage,
    accountCurrency,
    customExchangeRate,
    spread,
    slippage,
    commissionPerUnit,
  ]);

  // Reset calculator to clean defaults
  const handleReset = () => {
    setEntryPrice('');
    setStopLossPrice('');
    setTakeProfitPrice('');
    setSpread('');
    setSlippage('');
    setCommissionPerUnit('');
  };

  // History & Staging Handlers
  const handleSaveHistory = (res: CalculationResult) => {
    const added = PersistenceManager.addHistoryItem(res);
    setHistory((prev) => [added, ...prev].slice(0, 100));
  };

  const handleStageTrade = (res: CalculationResult) => {
    const staged = PersistenceManager.stageTrade({
      symbol: res.instrumentSymbol,
      direction: res.direction,
      entryPrice: res.entryPrice,
      stopLossPrice: res.stopLossPrice,
      permittedQuantity: res.permittedQuantity,
      quantityUnit: res.quantityUnit,
      grossEstimatedRisk: res.grossEstimatedRisk,
      accountCurrency: res.accountCurrency,
    });
    setStagedTrades((prev) => [staged, ...prev]);
  };

  const handleDeleteHistoryItem = (id: string) => {
    PersistenceManager.removeHistoryItem(id);
    setHistory((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearAllHistory = () => {
    PersistenceManager.clearHistory();
    setHistory([]);
  };

  const handleRemoveStagedTrade = (id: string) => {
    PersistenceManager.removeStagedTrade(id);
    setStagedTrades((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearAllStagedTrades = () => {
    PersistenceManager.clearStagedTrades();
    setStagedTrades([]);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header Utilities: History and Planner buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">Active Workspace:</span>
          <span className="text-xs font-mono text-indigo-400 font-bold">
            {selectedInstrument.symbol}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-xs text-slate-400">
            Account: <strong className="text-slate-200">{accountCurrency}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsPlannerModalOpen(true)}
            leftIcon={<ListPlus className="w-3.5 h-3.5" />}
          >
            Planner ({stagedTrades.length})
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsHistoryModalOpen(true)}
            leftIcon={<History className="w-3.5 h-3.5" />}
          >
            History ({history.length})
          </Button>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-slate-800/90 shadow-2xl">
            <CardContent className="space-y-4 p-5 md:p-6">
              {/* Step 1: Asset Class Selector */}
              <AssetClassSelector
                selectedClass={selectedAssetClass}
                onSelect={handleSelectAssetClass}
              />

              {/* Step 2: Searchable Instrument Selector */}
              <InstrumentSelector
                instruments={instruments}
                selectedInstrument={selectedInstrument}
                selectedAssetClass={selectedAssetClass}
                onSelectInstrument={handleSelectInstrument}
                onOpenSpecsModal={() => setIsSpecsModalOpen(true)}
                onOpenNewCustomModal={() => setIsNewCustomModalOpen(true)}
              />

              {/* Step 3: Trade Direction Selector */}
              <TradeDirectionSelector
                direction={direction}
                onChange={setDirection}
                directionError={
                  calculationResult.errors.find((e) => e.includes('strictly'))
                }
              />

              {/* Step 4: Risk Settings */}
              <RiskInput
                riskMode={riskMode}
                onRiskModeChange={setRiskMode}
                accountCurrency={accountCurrency}
                onAccountCurrencyChange={setAccountCurrency}
                riskCashAmount={riskCashAmount}
                onRiskCashAmountChange={setRiskCashAmount}
                accountEquity={accountEquity}
                onAccountEquityChange={setAccountEquity}
                riskPercentage={riskPercentage}
                onRiskPercentageChange={setRiskPercentage}
                accountBaseMode={accountBaseMode}
                onAccountBaseModeChange={setAccountBaseMode}
              />

              {/* Step 5: Entry and Stop Loss Prices */}
              <PriceInputs
                instrument={selectedInstrument}
                direction={direction}
                entryPrice={entryPrice}
                onEntryPriceChange={setEntryPrice}
                stopLossPrice={stopLossPrice}
                onStopLossPriceChange={setStopLossPrice}
                takeProfitPrice={takeProfitPrice}
                onTakeProfitPriceChange={setTakeProfitPrice}
                priceError={
                  calculationResult.errors.find((e) => e.includes('Stop-loss'))
                }
              />

              {/* Advanced Broker Costs & Spreads Accordion */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between text-left py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  <span>Advanced Settings: Broker Profiles, Spreads & Fees</span>
                  {showAdvanced ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showAdvanced && (
                  <div className="pt-3 pb-1 space-y-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <div>
                      <label className="block text-slate-300 mb-1">
                        Select Broker Preset Profile
                      </label>
                      <select
                        value={selectedBrokerProfile}
                        onChange={(e) => handleBrokerProfileChange(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg text-slate-100 p-2 cursor-pointer"
                      >
                        {BROKER_PROFILES.map((bp) => (
                          <option key={bp.id} value={bp.id}>
                            {bp.name} — {bp.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-slate-400 mb-1">Estimated Spread (Pips/Pts)</label>
                        <input
                          type="number"
                          step="any"
                          value={spread}
                          onChange={(e) => setSpread(e.target.value)}
                          placeholder="e.g. 0.5"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg text-slate-100 p-2 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Estimated Slippage</label>
                        <input
                          type="number"
                          step="any"
                          value={slippage}
                          onChange={(e) => setSlippage(e.target.value)}
                          placeholder="e.g. 0.2"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg text-slate-100 p-2 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">
                          Commission per Lot/Unit ({accountCurrency})
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={commissionPerUnit}
                          onChange={(e) => setCommissionPerUnit(e.target.value)}
                          placeholder="e.g. 3.50"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg text-slate-100 p-2 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">
                        Manual Exchange Rate Override ({selectedInstrument.profitCurrency} to {accountCurrency})
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={customExchangeRate}
                        onChange={(e) => setCustomExchangeRate(e.target.value)}
                        placeholder="Leave empty for standard reference rate..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg text-slate-100 p-2 font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Output Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <ResultsPanel
            result={calculationResult}
            onReset={handleReset}
            onSaveHistory={handleSaveHistory}
            onStageTrade={handleStageTrade}
            onOpenSpecsModal={() => setIsSpecsModalOpen(true)}
          />

          {/* Mathematical Proof and Breakdown Accordion */}
          <CalculationBreakdown result={calculationResult} />
        </div>
      </div>

      {/* Modals */}
      <InstrumentSpecificationModal
        isOpen={isSpecsModalOpen}
        onClose={() => setIsSpecsModalOpen(false)}
        instrument={selectedInstrument}
        onSaveSpec={handleSaveSpec}
        onResetSpecToDefault={handleResetSpecToDefault}
      />

      <NewCustomInstrumentModal
        isOpen={isNewCustomModalOpen}
        onClose={() => setIsNewCustomModalOpen(false)}
        onAddCustomInstrument={handleAddCustomInstrument}
      />

      <CalculationHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        onDeleteHistoryItem={handleDeleteHistoryItem}
        onClearAllHistory={handleClearAllHistory}
      />

      <MultiTradePlannerModal
        isOpen={isPlannerModalOpen}
        onClose={() => setIsPlannerModalOpen(false)}
        stagedTrades={stagedTrades}
        onRemoveTrade={handleRemoveStagedTrade}
        onClearAllTrades={handleClearAllStagedTrades}
        accountCurrency={accountCurrency}
      />
    </div>
  );
};
