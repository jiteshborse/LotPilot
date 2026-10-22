export type AssetClass =
  | 'forex'
  | 'precious_metals'
  | 'commodities'
  | 'crypto_spot'
  | 'crypto_derivatives'
  | 'indices'
  | 'us_stocks'
  | 'indian_stocks'
  | 'indian_derivatives'
  | 'futures'
  | 'options'
  | 'custom';

export type InstrumentType =
  | 'forex_pair'
  | 'spot_metal'
  | 'commodity_cfd'
  | 'crypto_spot'
  | 'crypto_linear_perp'
  | 'crypto_inverse_perp'
  | 'index_cfd'
  | 'index_futures'
  | 'equity_share'
  | 'indian_equity_share'
  | 'indian_future'
  | 'indian_option'
  | 'commodity_future'
  | 'equity_option'
  | 'custom';

export type PayoffModel =
  | 'linear'
  | 'inverse'
  | 'options_premium'
  | 'point_value'
  | 'tick_value';

export type SpecificationSource =
  | 'verified_exchange'
  | 'verified_broker'
  | 'user_configured'
  | 'illustrative_example'
  | 'incomplete';

export type SpecificationStatus = 'active' | 'stale' | 'draft';

export type CommissionType = 'per_lot' | 'per_share' | 'percentage_notional' | 'flat';

export interface CommissionConfiguration {
  type: CommissionType;
  value: number; // e.g. $3.50 per lot, or 0.04% of notional
}

export interface MarginConfiguration {
  type: 'percentage' | 'leverage';
  value: number; // e.g. 5% (0.05) or 30 (1:30 leverage)
}

export interface InstrumentSpecification {
  id: string;
  symbol: string;
  displayName: string;
  assetClass: AssetClass;
  instrumentType: InstrumentType;
  baseCurrency: string;
  quoteCurrency: string;
  profitCurrency: string;
  
  // Contract sizing & multipliers
  contractSize: number; // e.g., 100,000 for FX standard, 100 for Gold, 1 for spot crypto
  contractMultiplier?: number; // e.g., 100 for standard equity options, 50 for ES
  
  // Price increments
  pipSize?: number; // e.g. 0.0001 (0.01 for JPY)
  tickSize: number; // e.g. 0.00001 for FX, 0.01 for stocks, 0.25 for ES, 0.05 for NSE
  tickValue?: number; // tick value in profit/tick currency per lot/contract
  tickValueCurrency?: string;
  valuePerPoint?: number; // e.g., $1 or $10 per index point per lot
  
  // Trading quantity limits
  quantityStep: number; // minimum increment e.g. 0.01, 0.001, 1, 25 (Nifty)
  minimumQuantity: number;
  maximumQuantity?: number;
  exchangeLotSize?: number; // for derivatives with mandatory lot bundles (e.g. NIFTY=25)
  minimumNotional?: number; // e.g. $10
  fractionalTradingAllowed: boolean;
  
  // Payoff and execution rules
  payoffModel: PayoffModel;
  commissionConfiguration?: CommissionConfiguration;
  marginConfiguration?: MarginConfiguration;
  
  // Provenance & Audit
  specificationSource: SpecificationSource;
  specificationStatus: SpecificationStatus;
  lastUpdatedAt: string;
  notes?: string;
}

export type TradeDirection = 'long' | 'short';
export type RiskMode = 'fixed_cash' | 'percentage';
export type AccountBaseMode = 'balance' | 'equity';

export interface CalculationInputs {
  instrument: InstrumentSpecification;
  direction: TradeDirection;
  entryPrice: number | string;
  stopLossPrice: number | string;
  takeProfitPrice?: number | string;
  
  riskMode: RiskMode;
  riskCashAmount?: number | string;
  accountEquity?: number | string;
  riskPercentage?: number | string;
  accountCurrency: string;
  
  // Optional custom exchange rate override
  customExchangeRate?: number | string;
  
  // Optional trading costs
  spread?: number | string; // in pips/points
  slippage?: number | string; // in pips/points
  commissionPerUnit?: number | string; // manual override in account currency
}

export interface RewardToRiskCalculation {
  targetDistance: string;
  targetDistanceDisplay: string;
  potentialGrossReward: string;
  potentialAllInReward: string;
  rewardToRiskRatio: string;
  allInRewardToRiskRatio: string;
}

export interface CalculationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  assumptions: string[];
  
  // Risk budget
  riskBudget: string;
  accountCurrency: string;
  
  // Price and distances
  direction: TradeDirection;
  entryPrice: string;
  stopLossPrice: string;
  stopLossDistance: string;
  stopLossDistanceDisplay: string;
  stopLossDistancePipsOrTicks: string;
  stopLossDistanceUnit: 'pips' | 'points' | 'ticks' | 'dollars' | 'currency';
  stopLossPercentage: string;
  
  // Position sizing
  theoreticalQuantity: string;
  permittedQuantity: string;
  quantityUnit: string; // lots, shares, contracts, coins
  stepIncrement: string;
  
  // Valuations per unit
  lossPerUnitQuote: string;
  lossPerUnitAccount: string;
  profitCurrency: string;
  conversionRateApplied: string;
  conversionPath: string;
  
  // Financial Risk outputs
  grossEstimatedRisk: string;
  estimatedCommissionCost: string;
  estimatedSpreadCost: string;
  estimatedSlippageCost: string;
  allInEstimatedRisk: string;
  riskBudgetUsagePercent: string;
  
  // Capital & Margin
  notionalExposure: string;
  estimatedMargin: string;
  
  // Risk/Reward if TP provided
  rewardToRisk?: RewardToRiskCalculation;
  
  // Metadata
  instrumentId: string;
  instrumentSymbol: string;
  assetClass: AssetClass;
  specificationSource: SpecificationSource;
  calculatedAt: number;
}
