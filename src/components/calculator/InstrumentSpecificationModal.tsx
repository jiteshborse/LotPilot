import React, { useState } from 'react';
import { InstrumentSpecification } from '../../lib/calculations/types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { RotateCcw, Save } from 'lucide-react';

interface InstrumentSpecificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  instrument: InstrumentSpecification;
  onSaveSpec: (updatedSpec: InstrumentSpecification) => void;
  onResetSpecToDefault: (symbol: string) => void;
}

export const InstrumentSpecificationModal: React.FC<InstrumentSpecificationModalProps> = ({
  isOpen,
  onClose,
  instrument,
  onSaveSpec,
  onResetSpecToDefault,
}) => {
  const [formData, setFormData] = useState<InstrumentSpecification>({ ...instrument });

  // Keep synced if instrument changes
  React.useEffect(() => {
    setFormData({ ...instrument });
  }, [instrument]);

  const handleChange = (field: keyof InstrumentSpecification, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === 'string' && !isNaN(Number(value)) && value.trim() !== '' ? Number(value) : value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSpec({
      ...formData,
      specificationSource: 'user_configured',
      lastUpdatedAt: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  const handleReset = () => {
    onResetSpecToDefault(instrument.symbol);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Contract Specifications: ${instrument.symbol}`}
      description="View or customize contract parameters, trading increments, and commission rules."
      maxWidth="2xl"
    >
      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <div className="flex items-center justify-between p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
          <div>
            <div className="font-semibold text-white text-sm">{formData.displayName}</div>
            <div className="text-slate-400 text-[11px]">Asset Class: {formData.assetClass}</div>
          </div>
          <Badge variant="blue" size="sm">
            Source: {formData.specificationSource}
          </Badge>
        </div>

        {/* Contract Sizing & Increments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Contract Size (Units / Ounces / Barrels per lot)"
            type="number"
            step="any"
            value={formData.contractSize}
            onChange={(e) => handleChange('contractSize', e.target.value)}
          />

          <Input
            label="Quantity Step Increment (e.g. 0.01 or 1)"
            type="number"
            step="any"
            value={formData.quantityStep}
            onChange={(e) => handleChange('quantityStep', e.target.value)}
          />

          <Input
            label="Minimum Permitted Order Quantity"
            type="number"
            step="any"
            value={formData.minimumQuantity}
            onChange={(e) => handleChange('minimumQuantity', e.target.value)}
          />

          <Input
            label="Exchange Lot Size Bundle (e.g. 25 for NIFTY)"
            type="number"
            step="any"
            value={formData.exchangeLotSize || ''}
            onChange={(e) => handleChange('exchangeLotSize', e.target.value)}
            placeholder="Optional"
          />

          {formData.pipSize !== undefined && (
            <Input
              label="Pip Size (e.g. 0.0001 or 0.01 for JPY)"
              type="number"
              step="any"
              value={formData.pipSize}
              onChange={(e) => handleChange('pipSize', e.target.value)}
            />
          )}

          {formData.valuePerPoint !== undefined && (
            <Input
              label="Value Per Index Point per Contract"
              type="number"
              step="any"
              value={formData.valuePerPoint}
              onChange={(e) => handleChange('valuePerPoint', e.target.value)}
            />
          )}

          <Input
            label="Tick Size (Minimum Price Move)"
            type="number"
            step="any"
            value={formData.tickSize}
            onChange={(e) => handleChange('tickSize', e.target.value)}
          />

          {formData.tickValue !== undefined && (
            <Input
              label="Tick Value (Profit Currency per Contract)"
              type="number"
              step="any"
              value={formData.tickValue}
              onChange={(e) => handleChange('tickValue', e.target.value)}
            />
          )}
        </div>

        {/* Currencies */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
          <Input
            label="Quote Currency"
            value={formData.quoteCurrency}
            onChange={(e) => handleChange('quoteCurrency', e.target.value.toUpperCase())}
          />
          <Input
            label="Profit / Settlement Currency"
            value={formData.profitCurrency}
            onChange={(e) => handleChange('profitCurrency', e.target.value.toUpperCase())}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Broker Specification Notes
          </label>
          <textarea
            rows={2}
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Document broker spreads, rollover times, or leverage tiers..."
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset to Default
          </Button>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              leftIcon={<Save className="w-3.5 h-3.5" />}
            >
              Apply & Save
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
