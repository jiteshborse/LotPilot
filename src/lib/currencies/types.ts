export interface ExchangeRate {
  pair: string; // e.g. "EUR/USD", "USD/JPY"
  baseCurrency: string;
  quoteCurrency: string;
  rate: number;
  source: 'reference_default' | 'manual_override' | 'live_provider';
  timestamp: number;
}

export interface ConversionResult {
  fromCurrency: string;
  toCurrency: string;
  rate: string; // formatted decimal
  multiplier: string; // the factor: amountInTo = amountInFrom * multiplier
  path: string; // e.g. "Direct EUR/USD (1.0850)" or "USD/CHF Inverse (1 / 0.8320)"
  source: string;
  timestamp: number;
  isStale?: boolean;
}
