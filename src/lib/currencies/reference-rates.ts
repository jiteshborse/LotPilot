import { ExchangeRate } from './types';

// Standard reference rates with explicit static provenance
// Timestamped to 2026-10-22 reference point
export const DEFAULT_REFERENCE_RATES: Record<string, ExchangeRate> = {
  'EUR/USD': { pair: 'EUR/USD', baseCurrency: 'EUR', quoteCurrency: 'USD', rate: 1.0850, source: 'reference_default', timestamp: 1776850000000 },
  'GBP/USD': { pair: 'GBP/USD', baseCurrency: 'GBP', quoteCurrency: 'USD', rate: 1.2950, source: 'reference_default', timestamp: 1776850000000 },
  'AUD/USD': { pair: 'AUD/USD', baseCurrency: 'AUD', quoteCurrency: 'USD', rate: 0.6650, source: 'reference_default', timestamp: 1776850000000 },
  'NZD/USD': { pair: 'NZD/USD', baseCurrency: 'NZD', quoteCurrency: 'USD', rate: 0.5980, source: 'reference_default', timestamp: 1776850000000 },
  'USD/JPY': { pair: 'USD/JPY', baseCurrency: 'USD', quoteCurrency: 'JPY', rate: 153.50, source: 'reference_default', timestamp: 1776850000000 },
  'USD/CHF': { pair: 'USD/CHF', baseCurrency: 'USD', quoteCurrency: 'CHF', rate: 0.8320, source: 'reference_default', timestamp: 1776850000000 },
  'USD/CAD': { pair: 'USD/CAD', baseCurrency: 'USD', quoteCurrency: 'CAD', rate: 1.3850, source: 'reference_default', timestamp: 1776850000000 },
  'USD/INR': { pair: 'USD/INR', baseCurrency: 'USD', quoteCurrency: 'INR', rate: 86.80, source: 'reference_default', timestamp: 1776850000000 },
  'USD/USDT': { pair: 'USD/USDT', baseCurrency: 'USD', quoteCurrency: 'USDT', rate: 1.0000, source: 'reference_default', timestamp: 1776850000000 },
  'BTC/USD': { pair: 'BTC/USD', baseCurrency: 'BTC', quoteCurrency: 'USD', rate: 67500.00, source: 'reference_default', timestamp: 1776850000000 },
  'ETH/USD': { pair: 'ETH/USD', baseCurrency: 'ETH', quoteCurrency: 'USD', rate: 2650.00, source: 'reference_default', timestamp: 1776850000000 },
};
