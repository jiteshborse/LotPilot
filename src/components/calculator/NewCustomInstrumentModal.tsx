import React, { useState } from 'react';
import { InstrumentSpecification, AssetClass, PayoffModel } from '../../lib/calculations/types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { PlusCircle } from 'lucide-react';

interface NewCustomInstrumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomInstrument: (spec: InstrumentSpecification) => void;
}

export const NewCustomInstrumentModal: React.FC<NewCustomInstrumentModalProps> = ({
  isOpen,
  onClose,
  onAddCustomInstrument,
}) => {
  const [symbol, setSymbol] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [assetClass, setAssetClass] = useState<AssetClass>('custom');
  const [quoteCurrency, setQuoteCurrency] = useState('USD');
  const [profitCurrency, setProfitCurrency] = useState('USD');
  const [contractSize, setContractSize] = useState('100');
  const [quantityStep, setQuantityStep] = useState('0.01');
  const [minimumQuantity, setMinimumQuantity] = useState('0.01');
  const [tickSize, setTickSize] = useState('0.01');
  const [payoffModel, setPayoffModel] = useState<PayoffModel>('linear');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol) return;

    const newSpec: InstrumentSpecification = {
      id: `custom-${Date.now()}-${symbol.toLowerCase()}`,
      symbol: symbol.toUpperCase(),
      displayName: displayName || `${symbol.toUpperCase()} (Custom Instrument)`,
      assetClass,
      instrumentType: 'custom',
      baseCurrency: symbol.toUpperCase(),
      quoteCurrency: quoteCurrency.toUpperCase(),
      profitCurrency: profitCurrency.toUpperCase(),
      contractSize: parseFloat(contractSize) || 1,
      quantityStep: parseFloat(quantityStep) || 0.01,
      minimumQuantity: parseFloat(minimumQuantity) || 0.01,
      tickSize: parseFloat(tickSize) || 0.01,
      fractionalTradingAllowed: parseFloat(quantityStep) < 1,
      payoffModel,
      specificationSource: 'user_configured',
      specificationStatus: 'active',
      lastUpdatedAt: new Date().toISOString().split('T')[0],
      notes,
    };

    onAddCustomInstrument(newSpec);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Custom Instrument Specification"
      description="Define a custom contract specification for proprietary pairs, bespoke futures, or custom CFDs."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Instrument Symbol *"
            required
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="e.g. XAUGBP, MYPROP_NQ, TECH_INDEX"
          />

          <Input
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Gold / British Pound"
          />

          <Select
            label="Asset Class"
            value={assetClass}
            onChange={(e) => setAssetClass(e.target.value as AssetClass)}
            options={[
              { value: 'forex', label: 'Forex' },
              { value: 'precious_metals', label: 'Precious Metals' },
              { value: 'commodities', label: 'Commodities' },
              { value: 'crypto_spot', label: 'Crypto Spot' },
              { value: 'crypto_derivatives', label: 'Crypto Derivatives' },
              { value: 'indices', label: 'Indices' },
              { value: 'futures', label: 'Futures' },
              { value: 'us_stocks', label: 'US Stocks' },
              { value: 'indian_stocks', label: 'Indian Stocks' },
              { value: 'indian_derivatives', label: 'Indian Derivatives' },
              { value: 'options', label: 'Options' },
              { value: 'custom', label: 'Custom' },
            ]}
          />

          <Select
            label="Payoff Model"
            value={payoffModel}
            onChange={(e) => setPayoffModel(e.target.value as PayoffModel)}
            options={[
              { value: 'linear', label: 'Linear Contract (Distance × Contract Size)' },
              { value: 'point_value', label: 'Point Value (Points × Value Per Point)' },
              { value: 'tick_value', label: 'Tick Value ((Distance / Tick) × Tick Value)' },
              { value: 'inverse', label: 'Inverse Crypto (Coin Settled)' },
              { value: 'options_premium', label: 'Option Premium Movement' },
            ]}
          />

          <Input
            label="Contract Sizing Units (e.g. 100 for gold, 1 for spot)"
            type="number"
            step="any"
            value={contractSize}
            onChange={(e) => setContractSize(e.target.value)}
          />

          <Input
            label="Quantity Step Increment (e.g. 0.01, 0.001, 1)"
            type="number"
            step="any"
            value={quantityStep}
            onChange={(e) => setQuantityStep(e.target.value)}
          />

          <Input
            label="Minimum Permitted Order Size"
            type="number"
            step="any"
            value={minimumQuantity}
            onChange={(e) => setMinimumQuantity(e.target.value)}
          />

          <Input
            label="Tick Size"
            type="number"
            step="any"
            value={tickSize}
            onChange={(e) => setTickSize(e.target.value)}
          />

          <Input
            label="Quote Currency"
            value={quoteCurrency}
            onChange={(e) => setQuoteCurrency(e.target.value.toUpperCase())}
          />

          <Input
            label="Profit / Settlement Currency"
            value={profitCurrency}
            onChange={(e) => setProfitCurrency(e.target.value.toUpperCase())}
          />
        </div>

        <Input
          label="Notes & Assumptions"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes regarding broker contract rules..."
        />

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
          >
            Create Instrument
          </Button>
        </div>
      </form>
    </Modal>
  );
};
