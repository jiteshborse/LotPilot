import { AssetClass } from '../lib/calculations/types';

export interface AssetClassMeta {
  id: AssetClass;
  name: string;
  shortName: string;
  description: string;
  defaultUnit: string;
  icon: string; // Lucide icon name
  badgeColor: string;
  examples: string[];
}

export const ASSET_CLASSES: AssetClassMeta[] = [
  {
    id: 'forex',
    name: 'Forex (Currencies)',
    shortName: 'Forex',
    description: 'Major, minor, and exotic foreign currency pairs with pip-based valuation.',
    defaultUnit: 'lots',
    icon: 'DollarSign',
    badgeColor: 'blue',
    examples: ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD'],
  },
  {
    id: 'precious_metals',
    name: 'Precious Metals',
    shortName: 'Metals',
    description: 'Spot Gold (XAUUSD) and Silver (XAGUSD) with ounce-based contract sizing.',
    defaultUnit: 'lots',
    icon: 'Sparkles',
    badgeColor: 'amber',
    examples: ['XAUUSD (Gold)', 'XAGUSD (Silver)'],
  },
  {
    id: 'commodities',
    name: 'Commodity CFDs',
    shortName: 'Commodities',
    description: 'Crude Oil (WTI, Brent) and Natural Gas spot contracts and CFDs.',
    defaultUnit: 'lots',
    icon: 'Flame',
    badgeColor: 'orange',
    examples: ['USOIL (WTI)', 'BRENT', 'NATGAS'],
  },
  {
    id: 'crypto_spot',
    name: 'Cryptocurrency Spot',
    shortName: 'Crypto Spot',
    description: 'Direct spot digital asset purchases with coin-based fractional precision.',
    defaultUnit: 'coins',
    icon: 'Coins',
    badgeColor: 'indigo',
    examples: ['BTCUSD', 'BTCUSDT', 'ETHUSDT', 'SOLUSDT'],
  },
  {
    id: 'crypto_derivatives',
    name: 'Crypto Perpetuals & Futures',
    shortName: 'Crypto Perps',
    description: 'Linear USDT-margined perpetuals and inverse coin-margined derivatives.',
    defaultUnit: 'contracts',
    icon: 'Zap',
    badgeColor: 'purple',
    examples: ['BTCUSDT Linear Perp', 'BTCUSD Inverse Perp', 'ETHUSDT Perp'],
  },
  {
    id: 'indices',
    name: 'Indices & Index CFDs',
    shortName: 'Indices',
    description: 'Cash index CFDs tracking global equity benchmarks with point/tick values.',
    defaultUnit: 'contracts',
    icon: 'BarChart3',
    badgeColor: 'emerald',
    examples: ['US500 (S&P 500)', 'US100 (Nasdaq-100)', 'US30 (Dow Jones)'],
  },
  {
    id: 'futures',
    name: 'Exchange-Traded Futures',
    shortName: 'Futures',
    description: 'CME and global regulated index and commodity futures contracts with tick multipliers.',
    defaultUnit: 'contracts',
    icon: 'TrendingUp',
    badgeColor: 'cyan',
    examples: ['ES (E-mini S&P)', 'NQ (E-mini Nasdaq)', 'CL (Crude Oil)'],
  },
  {
    id: 'us_stocks',
    name: 'US Stocks & ETFs',
    shortName: 'US Equities',
    description: 'NYSE and NASDAQ cash equities and ETFs with share and capital requirement estimation.',
    defaultUnit: 'shares',
    icon: 'Building2',
    badgeColor: 'sky',
    examples: ['AAPL', 'MSFT', 'NVDA', 'SPY', 'QQQ'],
  },
  {
    id: 'indian_stocks',
    name: 'Indian Stocks & ETFs (NSE)',
    shortName: 'Indian Equities',
    description: 'National Stock Exchange of India (NSE) cash equity shares denominated in INR.',
    defaultUnit: 'shares',
    icon: 'Landmark',
    badgeColor: 'emerald',
    examples: ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY'],
  },
  {
    id: 'indian_derivatives',
    name: 'Indian Equity Derivatives (NSE F&O)',
    shortName: 'Indian F&O',
    description: 'NSE index and stock futures and options with mandatory exchange lot bundles.',
    defaultUnit: 'shares',
    icon: 'Layers',
    badgeColor: 'teal',
    examples: ['NIFTY 50 Futures (25/lot)', 'BANKNIFTY Futures (15/lot)', 'FINNIFTY Futures'],
  },
  {
    id: 'options',
    name: 'Options Contracts',
    shortName: 'Options',
    description: 'Standard 100-share equity options and index options with premium-based risk valuation.',
    defaultUnit: 'contracts',
    icon: 'Sliders',
    badgeColor: 'violet',
    examples: ['SPY Call Option', 'AAPL Put Option', 'NIFTY Call Option'],
  },
  {
    id: 'custom',
    name: 'Custom / User Defined',
    shortName: 'Custom',
    description: 'User-defined financial instrument with custom contract sizes, tick values, and payoff models.',
    defaultUnit: 'units',
    icon: 'Settings',
    badgeColor: 'slate',
    examples: ['Custom Prop Pair', 'Specialty Commodity', 'Bespoke Index'],
  },
];
