import { describe, it, expect } from 'vitest';
import { CalculationEngine } from '../../lib/calculations/engine';
import { InstrumentSpecification } from '../../lib/calculations/types';
import { CurrencyConverter } from '../../lib/currencies/conversion';

describe('LotPilot Calculation Engine - Required Regression Suite', () => {
  const engine = new CalculationEngine();

  // -------------------------------------------------------------
  // Case A: EURUSD
  // -------------------------------------------------------------
  it('Case A: EURUSD Short Position', () => {
    const eurusdSpec: InstrumentSpecification = {
      id: 'eurusd-std',
      symbol: 'EURUSD',
      displayName: 'Euro / US Dollar',
      assetClass: 'forex',
      instrumentType: 'forex_pair',
      baseCurrency: 'EUR',
      quoteCurrency: 'USD',
      profitCurrency: 'USD',
      contractSize: 100000,
      pipSize: 0.0001,
      tickSize: 0.00001,
      quantityStep: 0.01,
      minimumQuantity: 0.01,
      fractionalTradingAllowed: true,
      payoffModel: 'linear',
      specificationSource: 'verified_broker',
      specificationStatus: 'active',
      lastUpdatedAt: '2026-10-22',
    };

    const result = engine.calculate({
      instrument: eurusdSpec,
      direction: 'short',
      entryPrice: 1.13530,
      stopLossPrice: 1.13586,
      riskMode: 'fixed_cash',
      riskCashAmount: 20,
      accountCurrency: 'USD',
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    // Stop distance: 5.6 pips (0.00056)
    expect(result.stopLossDistancePipsOrTicks).toBe('5.6');
    // Theoretical: 20 / (0.00056 * 100,000) = 20 / 56 ≈ 0.357142857...
    expect(Number(result.theoreticalQuantity)).toBeCloseTo(0.357142, 4);
    // Rounded quantity: 0.35 lots
    expect(result.permittedQuantity).toBe('0.35');
    // Gross estimated risk: 0.35 * 56 = $19.60
    expect(result.grossEstimatedRisk).toBe('19.60');
    // Must never exceed risk budget
    expect(Number(result.grossEstimatedRisk)).toBeLessThanOrEqual(20);
  });

  // -------------------------------------------------------------
  // Case B: AUDUSD
  // -------------------------------------------------------------
  it('Case B: AUDUSD Short Position', () => {
    const audusdSpec: InstrumentSpecification = {
      id: 'audusd-std',
      symbol: 'AUDUSD',
      displayName: 'Australian Dollar / US Dollar',
      assetClass: 'forex',
      instrumentType: 'forex_pair',
      baseCurrency: 'AUD',
      quoteCurrency: 'USD',
      profitCurrency: 'USD',
      contractSize: 100000,
      pipSize: 0.0001,
      tickSize: 0.00001,
      quantityStep: 0.01,
      minimumQuantity: 0.01,
      fractionalTradingAllowed: true,
      payoffModel: 'linear',
      specificationSource: 'verified_broker',
      specificationStatus: 'active',
      lastUpdatedAt: '2026-10-22',
    };

    const result = engine.calculate({
      instrument: audusdSpec,
      direction: 'short',
      entryPrice: 0.70214,
      stopLossPrice: 0.70248,
      riskMode: 'fixed_cash',
      riskCashAmount: 50,
      accountCurrency: 'USD',
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    // Stop distance: 3.4 pips (0.00034)
    expect(result.stopLossDistancePipsOrTicks).toBe('3.4');
    // Theoretical: 50 / (0.00034 * 100000) = 50 / 34 = 1.470588...
    expect(result.theoreticalQuantity.slice(0, 8)).toBe('1.470588');
    // Rounded quantity: 1.47 lots
    expect(result.permittedQuantity).toBe('1.47');
    // Gross estimated risk: 1.47 * 34 = $49.98
    expect(result.grossEstimatedRisk).toBe('49.98');
    expect(Number(result.grossEstimatedRisk)).toBeLessThanOrEqual(50);
  });

  // -------------------------------------------------------------
  // Case C: XAUUSD (Gold) with step 0.001 and step 0.01
  // -------------------------------------------------------------
  it('Case C1: XAUUSD Short Position with 0.001 step', () => {
    const xauusdSpec001: InstrumentSpecification = {
      id: 'xauusd-std',
      symbol: 'XAUUSD',
      displayName: 'Gold (Ounces) / US Dollar',
      assetClass: 'precious_metals',
      instrumentType: 'spot_metal',
      baseCurrency: 'XAU',
      quoteCurrency: 'USD',
      profitCurrency: 'USD',
      contractSize: 100, // 100 oz per standard lot
      tickSize: 0.01,
      quantityStep: 0.001,
      minimumQuantity: 0.001,
      fractionalTradingAllowed: true,
      payoffModel: 'linear',
      specificationSource: 'illustrative_example',
      specificationStatus: 'active',
      lastUpdatedAt: '2026-10-22',
    };

    const result = engine.calculate({
      instrument: xauusdSpec001,
      direction: 'short',
      entryPrice: 4164,
      stopLossPrice: 4171,
      riskMode: 'fixed_cash',
      riskCashAmount: 20,
      accountCurrency: 'USD',
    });

    expect(result.isValid).toBe(true);
    // Stop distance: $7
    expect(result.stopLossDistance).toBe('7');
    // Loss per lot: 7 * 100 = 700
    expect(Number(result.lossPerUnitQuote)).toBe(700);
    // Theoretical: 20 / 700 = 0.0285714...
    expect(result.theoreticalQuantity.slice(0, 8)).toBe('0.028571');
    // Rounded quantity: 0.028 lots
    expect(result.permittedQuantity).toBe('0.028');
    // Gross estimated risk: 0.028 * 700 = $19.60
    expect(result.grossEstimatedRisk).toBe('19.60');
    expect(Number(result.grossEstimatedRisk)).toBeLessThanOrEqual(20);
  });

  it('Case C2: XAUUSD with 0.01 step rounding down', () => {
    const xauusdSpec01: InstrumentSpecification = {
      id: 'xauusd-step01',
      symbol: 'XAUUSD',
      displayName: 'Gold / US Dollar (0.01 Step)',
      assetClass: 'precious_metals',
      instrumentType: 'spot_metal',
      baseCurrency: 'XAU',
      quoteCurrency: 'USD',
      profitCurrency: 'USD',
      contractSize: 100,
      tickSize: 0.01,
      quantityStep: 0.01,
      minimumQuantity: 0.01,
      fractionalTradingAllowed: true,
      payoffModel: 'linear',
      specificationSource: 'illustrative_example',
      specificationStatus: 'active',
      lastUpdatedAt: '2026-10-22',
    };

    const result = engine.calculate({
      instrument: xauusdSpec01,
      direction: 'short',
      entryPrice: 4164,
      stopLossPrice: 4171,
      riskMode: 'fixed_cash',
      riskCashAmount: 20,
      accountCurrency: 'USD',
    });

    expect(result.isValid).toBe(true);
    // Floor to 0.01 step: 0.02 lots
    expect(result.permittedQuantity).toBe('0.02');
    // Gross risk: 0.02 * 700 = $14.00
    expect(result.grossEstimatedRisk).toBe('14.00');
    expect(Number(result.grossEstimatedRisk)).toBeLessThanOrEqual(20);
  });

  // -------------------------------------------------------------
  // Case D: BTCUSD
  // -------------------------------------------------------------
  it('Case D: BTCUSD Short Position', () => {
    const btcusdSpec: InstrumentSpecification = {
      id: 'btcusd-std',
      symbol: 'BTCUSD',
      displayName: 'Bitcoin / US Dollar',
      assetClass: 'crypto_spot',
      instrumentType: 'crypto_spot',
      baseCurrency: 'BTC',
      quoteCurrency: 'USD',
      profitCurrency: 'USD',
      contractSize: 1, // 1 BTC per contract/lot
      tickSize: 0.1,
      quantityStep: 0.01,
      minimumQuantity: 0.01,
      fractionalTradingAllowed: true,
      payoffModel: 'linear',
      specificationSource: 'illustrative_example',
      specificationStatus: 'active',
      lastUpdatedAt: '2026-10-22',
    };

    const result = engine.calculate({
      instrument: btcusdSpec,
      direction: 'short',
      entryPrice: 83280,
      stopLossPrice: 83540,
      riskMode: 'fixed_cash',
      riskCashAmount: 50,
      accountCurrency: 'USD',
    });

    expect(result.isValid).toBe(true);
    // Stop distance: $260
    expect(result.stopLossDistance).toBe('260');
    // Theoretical: 50 / 260 ≈ 0.19230769...
    expect(Number(result.theoreticalQuantity)).toBeCloseTo(0.192307, 4);
    // Rounded quantity: 0.19 lots
    expect(result.permittedQuantity).toBe('0.19');
    // Gross risk: 0.19 * 260 = $49.40
    expect(result.grossEstimatedRisk).toBe('49.40');
    expect(Number(result.grossEstimatedRisk)).toBeLessThanOrEqual(50);
  });

  // -------------------------------------------------------------
  // Case E: USDCHF Non-USD Quote Currency Conversion
  // -------------------------------------------------------------
  it('Case E: USDCHF Short Position with CHF/USD Conversion', () => {
    const usdchfSpec: InstrumentSpecification = {
      id: 'usdchf-std',
      symbol: 'USDCHF',
      displayName: 'US Dollar / Swiss Franc',
      assetClass: 'forex',
      instrumentType: 'forex_pair',
      baseCurrency: 'USD',
      quoteCurrency: 'CHF',
      profitCurrency: 'CHF',
      contractSize: 100000,
      pipSize: 0.0001,
      tickSize: 0.00001,
      quantityStep: 0.01,
      minimumQuantity: 0.01,
      fractionalTradingAllowed: true,
      payoffModel: 'linear',
      specificationSource: 'verified_broker',
      specificationStatus: 'active',
      lastUpdatedAt: '2026-10-22',
    };

    // Converter with custom USD/CHF rate of 0.8320 as configured in regression test
    const customConverter = new CurrencyConverter({
      'USD/CHF': {
        pair: 'USD/CHF',
        baseCurrency: 'USD',
        quoteCurrency: 'CHF',
        rate: 0.8320,
        source: 'reference_default',
        timestamp: Date.now(),
      },
    });

    const engineWithCustomRate = new CalculationEngine(customConverter);

    const result = engineWithCustomRate.calculate({
      instrument: usdchfSpec,
      direction: 'short',
      entryPrice: 0.83160,
      stopLossPrice: 0.83240,
      riskMode: 'fixed_cash',
      riskCashAmount: 20,
      accountCurrency: 'USD',
    });

    expect(result.isValid).toBe(true);
    // Stop distance: 8.0 pips (0.00080)
    expect(result.stopLossDistancePipsOrTicks).toBe('8.0');
    // Pip value in CHF: 0.0001 * 100,000 = 10 CHF per standard lot
    // Converted to USD at 1 / 0.8320 = 1.201923 USD per pip
    // Total loss per lot = 8 * 12.01923 = 96.1538 USD
    // Theoretical lots: 20 / 96.1538 = 0.207999 lots
    // Permitted: 0.20 lots
    expect(result.permittedQuantity).toBe('0.20');
    // Gross risk <= $20
    expect(Number(result.grossEstimatedRisk)).toBeLessThanOrEqual(20);
    // Expected risk: 0.20 * 96.1538 = ~19.23 USD
    expect(Number(result.grossEstimatedRisk)).toBeGreaterThan(19);
    expect(Number(result.grossEstimatedRisk)).toBeLessThan(20);
  });

  // -------------------------------------------------------------
  // Indian Derivative Lot Size Enforcement (NIFTY 50)
  // -------------------------------------------------------------
  it('Indian Derivatives: Enforces Exchange Lot Bundle Increment (NIFTY 50 = 25/lot)', () => {
    const niftyFutureSpec: InstrumentSpecification = {
      id: 'nifty-fut',
      symbol: 'NIFTY_FUT',
      displayName: 'NIFTY 50 Futures',
      assetClass: 'indian_derivatives',
      instrumentType: 'indian_future',
      baseCurrency: 'INR',
      quoteCurrency: 'INR',
      profitCurrency: 'INR',
      contractSize: 1,
      exchangeLotSize: 25, // Mandatory 25 lot size bundle
      quantityStep: 25,
      minimumQuantity: 25,
      tickSize: 0.05,
      fractionalTradingAllowed: false,
      payoffModel: 'linear',
      specificationSource: 'verified_exchange',
      specificationStatus: 'active',
      lastUpdatedAt: '2026-10-22',
    };

    const result = engine.calculate({
      instrument: niftyFutureSpec,
      direction: 'long',
      entryPrice: 24500,
      stopLossPrice: 24450, // 50 pts stop
      riskMode: 'fixed_cash',
      riskCashAmount: 3000, // INR 3,000 risk budget
      accountCurrency: 'INR',
    });

    expect(result.isValid).toBe(true);
    // Distance = 50 pts
    // Loss per unit = INR 50
    // Theoretical = 3000 / 50 = 60 shares
    // But exchangeLotSize = 25!
    // Floor to 25 step: 50 shares (2 lots)!
    expect(result.permittedQuantity).toBe('50');
    // Gross risk: 50 * 50 = INR 2,500 <= INR 3,000
    expect(result.grossEstimatedRisk).toBe('2500.00');
  });

  // -------------------------------------------------------------
  // Direction Validation
  // -------------------------------------------------------------
  it('Fails validation when Stop Loss conflicts with Trade Direction', () => {
    const sampleSpec: InstrumentSpecification = {
      id: 'aapl-cash',
      symbol: 'AAPL',
      displayName: 'Apple Inc.',
      assetClass: 'us_stocks',
      instrumentType: 'equity_share',
      baseCurrency: 'USD',
      quoteCurrency: 'USD',
      profitCurrency: 'USD',
      contractSize: 1,
      tickSize: 0.01,
      quantityStep: 1,
      minimumQuantity: 1,
      fractionalTradingAllowed: false,
      payoffModel: 'linear',
      specificationSource: 'verified_exchange',
      specificationStatus: 'active',
      lastUpdatedAt: '2026-10-22',
    };

    // Long position with stop ABOVE entry must fail
    const invalidLong = engine.calculate({
      instrument: sampleSpec,
      direction: 'long',
      entryPrice: 220,
      stopLossPrice: 230,
      riskMode: 'fixed_cash',
      riskCashAmount: 100,
      accountCurrency: 'USD',
    });

    expect(invalidLong.isValid).toBe(false);
    expect(invalidLong.errors).toContain(
      'For a Long position, Stop-Loss price must be strictly BELOW the Entry price.'
    );

    // Short position with stop BELOW entry must fail
    const invalidShort = engine.calculate({
      instrument: sampleSpec,
      direction: 'short',
      entryPrice: 220,
      stopLossPrice: 210,
      riskMode: 'fixed_cash',
      riskCashAmount: 100,
      accountCurrency: 'USD',
    });

    expect(invalidShort.isValid).toBe(false);
    expect(invalidShort.errors).toContain(
      'For a Short position, Stop-Loss price must be strictly ABOVE the Entry price.'
    );
  });

  // -------------------------------------------------------------
  // Case I: Options Reward & Payoff Model Regression
  // -------------------------------------------------------------
  it('Calculates Options Take-Profit Reward using contractMultiplier', () => {
    const spyOptSpec: InstrumentSpecification = {
      id: 'opt-spy-std',
      symbol: 'SPY_OPT',
      displayName: 'SPY Standard Equity Option',
      assetClass: 'options',
      instrumentType: 'equity_option',
      baseCurrency: 'USD',
      quoteCurrency: 'USD',
      profitCurrency: 'USD',
      contractSize: 1,
      contractMultiplier: 100, // 100 shares per contract
      tickSize: 0.01,
      quantityStep: 1,
      minimumQuantity: 1,
      fractionalTradingAllowed: false,
      payoffModel: 'options_premium',
      specificationSource: 'verified_exchange',
      specificationStatus: 'active',
      lastUpdatedAt: '2026-10-22',
    };

    const res = engine.calculate({
      instrument: spyOptSpec,
      direction: 'long',
      entryPrice: 5.0,
      stopLossPrice: 3.0, // $2.00 risk per share * 100 = $200 per contract
      takeProfitPrice: 9.0, // $4.00 profit target per share * 100 = $400 per contract
      riskMode: 'fixed_cash',
      riskCashAmount: 400, // Permits 2 contracts ($400 gross risk)
      accountCurrency: 'USD',
    });

    expect(res.isValid).toBe(true);
    expect(res.permittedQuantity).toBe('2');
    expect(res.grossEstimatedRisk).toBe('400.00');
    // 2 contracts * $4.00/share * 100 shares = $800.00 gross reward
    expect(res.rewardToRisk?.potentialGrossReward).toBe('800.00');
    expect(res.rewardToRisk?.allInRewardToRiskRatio).toBe('1:2.00');
  });

  // -------------------------------------------------------------
  // Case J: Commodity Spread & Slippage Valuation (Contract Size Scaling)
  // -------------------------------------------------------------
  it('Scales spread and slippage on non-pip commodity instruments by contractSize', () => {
    const goldSpec: InstrumentSpecification = {
      id: 'metal-xauusd',
      symbol: 'XAUUSD',
      displayName: 'XAU/USD (Spot Gold)',
      assetClass: 'precious_metals',
      instrumentType: 'spot_metal',
      baseCurrency: 'XAU',
      quoteCurrency: 'USD',
      profitCurrency: 'USD',
      contractSize: 100, // 100 troy oz per lot
      tickSize: 0.01,
      quantityStep: 0.01,
      minimumQuantity: 0.01,
      fractionalTradingAllowed: true,
      payoffModel: 'linear',
      specificationSource: 'verified_broker',
      specificationStatus: 'active',
      lastUpdatedAt: '2026-10-22',
    };

    const res = engine.calculate({
      instrument: goldSpec,
      direction: 'long',
      entryPrice: 2000,
      stopLossPrice: 1990,
      riskMode: 'fixed_cash',
      riskCashAmount: 1000, // Permits 1.00 lot
      accountCurrency: 'USD',
      spread: 0.50, // $0.50 spread per oz
      slippage: 0.20, // $0.20 slippage per oz
    });

    expect(res.isValid).toBe(true);
    expect(res.permittedQuantity).toBe('1.00');
    // 1.00 lot * 100 oz * $0.50/oz = $50.00 spread cost
    expect(res.estimatedSpreadCost).toBe('50.00');
    // 1.00 lot * 100 oz * $0.20/oz = $20.00 slippage cost
    expect(res.estimatedSlippageCost).toBe('20.00');
    expect(res.allInEstimatedRisk).toBe('1070.00');
  });

  // -------------------------------------------------------------
  // Case K: NIFTY Option Sizing (Contract Multiplier vs Step Increment)
  // -------------------------------------------------------------
  it('Sizes Indian options in single contract increments without step collapse', () => {
    const niftyOptSpec: InstrumentSpecification = {
      id: 'opt-nifty-call',
      symbol: 'NIFTY_OPT',
      displayName: 'NIFTY Index Option',
      assetClass: 'options',
      instrumentType: 'indian_option',
      baseCurrency: 'INR',
      quoteCurrency: 'INR',
      profitCurrency: 'INR',
      contractSize: 1,
      contractMultiplier: 25, // 25 shares per lot
      tickSize: 0.05,
      quantityStep: 1,
      minimumQuantity: 1,
      fractionalTradingAllowed: false,
      payoffModel: 'options_premium',
      specificationSource: 'verified_exchange',
      specificationStatus: 'active',
      lastUpdatedAt: '2026-10-22',
    };

    const res = engine.calculate({
      instrument: niftyOptSpec,
      direction: 'long',
      entryPrice: 150,
      stopLossPrice: 130, // 20 pts risk * 25 = 500 INR per contract
      riskMode: 'fixed_cash',
      riskCashAmount: 3000, // 3,000 INR budget -> permits exactly 6 contracts!
      accountCurrency: 'INR',
    });

    expect(res.isValid).toBe(true);
    expect(res.permittedQuantity).toBe('6');
    expect(res.grossEstimatedRisk).toBe('3000.00');
    expect(res.warnings).toHaveLength(0);
  });

  // -------------------------------------------------------------
  // Case L: Inverse Cryptocurrency Perpetual Valuation
  // -------------------------------------------------------------
  it('Correctly calculates inverse crypto perpetual position sizing in USD quote', () => {
    const btcInvSpec: InstrumentSpecification = {
      id: 'crypto-btcusd-inverse',
      symbol: 'BTCUSD_INVERSE',
      displayName: 'BTC/USD Inverse Perpetual',
      assetClass: 'crypto_derivatives',
      instrumentType: 'crypto_inverse_perp',
      baseCurrency: 'BTC',
      quoteCurrency: 'USD',
      profitCurrency: 'BTC',
      contractSize: 1, // $1 USD face value per contract
      tickSize: 0.5,
      quantityStep: 1,
      minimumQuantity: 1,
      fractionalTradingAllowed: false,
      payoffModel: 'inverse',
      specificationSource: 'verified_exchange',
      specificationStatus: 'active',
      lastUpdatedAt: '2026-10-22',
    };

    const res = engine.calculate({
      instrument: btcInvSpec,
      direction: 'long',
      entryPrice: 50000,
      stopLossPrice: 45000, // 10% move from 50k to 45k = $0.10 loss per $1 contract
      riskMode: 'fixed_cash',
      riskCashAmount: 100, // $100 risk budget
      accountCurrency: 'USD',
    });

    expect(res.isValid).toBe(true);
    // $100 budget / $0.10 loss per contract = 1,000 contracts
    expect(res.permittedQuantity).toBe('1000');
    expect(res.grossEstimatedRisk).toBe('100.00');
    expect(res.lossPerUnitQuote).toBe('0.100000');
  });
});
