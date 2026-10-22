import { describe, it, expect, beforeEach } from 'vitest';
import { PersistenceManager } from '../../lib/persistence/storage';
import { CalculationResult } from '../../lib/calculations/types';

describe('LotPilot Persistence Manager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('retrieves default preferences if none stored', () => {
    const prefs = PersistenceManager.getPreferences();
    expect(prefs.accountCurrency).toBe('USD');
    expect(prefs.riskMode).toBe('fixed_cash');
    expect(prefs.defaultRiskCash).toBe(50);
  });

  it('saves and updates user preferences', () => {
    PersistenceManager.savePreferences({
      accountCurrency: 'INR',
      defaultRiskCash: 1000,
    });

    const updated = PersistenceManager.getPreferences();
    expect(updated.accountCurrency).toBe('INR');
    expect(updated.defaultRiskCash).toBe(1000);
  });

  it('adds calculation history and generates valid CSV export', () => {
    const mockResult: CalculationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      assumptions: [],
      riskBudget: '20.00',
      accountCurrency: 'USD',
      direction: 'short',
      entryPrice: '1.13530',
      stopLossPrice: '1.13586',
      stopLossDistance: '0.00056',
      stopLossDistanceDisplay: '5.6 pips',
      stopLossDistancePipsOrTicks: '5.6',
      stopLossDistanceUnit: 'pips',
      stopLossPercentage: '0.05',
      theoreticalQuantity: '0.357143',
      permittedQuantity: '0.35',
      quantityUnit: 'lots',
      stepIncrement: '0.01',
      lossPerUnitQuote: '56.00',
      lossPerUnitAccount: '56.00',
      profitCurrency: 'USD',
      conversionRateApplied: '1',
      conversionPath: 'Direct Identity (1:1)',
      grossEstimatedRisk: '19.60',
      estimatedCommissionCost: '0.00',
      estimatedSpreadCost: '0.00',
      estimatedSlippageCost: '0.00',
      allInEstimatedRisk: '19.60',
      riskBudgetUsagePercent: '98.00',
      notionalExposure: '39735.50',
      estimatedMargin: '1324.52',
      instrumentId: 'fx-eurusd',
      instrumentSymbol: 'EURUSD',
      assetClass: 'forex',
      specificationSource: 'verified_broker',
      calculatedAt: Date.now(),
    };

    const added = PersistenceManager.addHistoryItem(mockResult, 'EURUSD scalp test');
    expect(added.id).toBeDefined();

    const history = PersistenceManager.getHistory();
    expect(history).toHaveLength(1);
    expect(history[0].result.permittedQuantity).toBe('0.35');

    const csv = PersistenceManager.exportHistoryToCsv();
    expect(csv).toContain('EURUSD');
    expect(csv).toContain('0.35');
    expect(csv).toContain('19.60');

    // Remove item
    PersistenceManager.removeHistoryItem(added.id);
    expect(PersistenceManager.getHistory()).toHaveLength(0);
  });
});
