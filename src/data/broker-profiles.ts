import { CommissionConfiguration, MarginConfiguration } from '../lib/calculations/types';

export interface BrokerProfile {
  id: string;
  name: string;
  description: string;
  assetClassSupport: string[];
  defaultCommission?: CommissionConfiguration;
  defaultMargin?: MarginConfiguration;
  spreadEstimatePips?: number;
  slippageEstimatePips?: number;
}

export const BROKER_PROFILES: BrokerProfile[] = [
  {
    id: 'raw-ecn',
    name: 'Raw Spread ECN Broker',
    description: 'Ultra-low spreads with a transparent commission (e.g. $3.50 per standard lot per side).',
    assetClassSupport: ['forex', 'precious_metals', 'commodities', 'indices'],
    defaultCommission: { type: 'per_lot', value: 7.00 }, // $7 round-turn
    defaultMargin: { type: 'leverage', value: 30 },
    spreadEstimatePips: 0.2,
    slippageEstimatePips: 0.1,
  },
  {
    id: 'standard-spread',
    name: 'Standard Account (Zero Commission)',
    description: 'Commission-free trading with spreads marked up into the bid/ask price.',
    assetClassSupport: ['forex', 'precious_metals', 'commodities', 'indices'],
    defaultCommission: { type: 'per_lot', value: 0 },
    defaultMargin: { type: 'leverage', value: 30 },
    spreadEstimatePips: 1.2,
    slippageEstimatePips: 0.2,
  },
  {
    id: 'prop-firm',
    name: 'Prop Firm Evaluation Account',
    description: 'Standard simulated challenge account with regulated leverage limits and strict risk rules.',
    assetClassSupport: ['forex', 'precious_metals', 'commodities', 'indices', 'crypto_derivatives'],
    defaultCommission: { type: 'per_lot', value: 5.00 },
    defaultMargin: { type: 'leverage', value: 50 },
    spreadEstimatePips: 0.5,
    slippageEstimatePips: 0.2,
  },
  {
    id: 'us-equity-broker',
    name: 'US Cash & Margin Broker (Reg T)',
    description: 'SEC / FINRA regulated broker with zero stock commissions and standard Reg T margin.',
    assetClassSupport: ['us_stocks', 'options'],
    defaultCommission: { type: 'per_share', value: 0 },
    defaultMargin: { type: 'percentage', value: 50 },
  },
  {
    id: 'crypto-deriv-exchange',
    name: 'Crypto Derivatives Exchange',
    description: 'Major digital asset exchange with taker fees (0.05% of notional) and high leverage.',
    assetClassSupport: ['crypto_spot', 'crypto_derivatives'],
    defaultCommission: { type: 'percentage_notional', value: 0.05 },
    defaultMargin: { type: 'leverage', value: 20 },
  },
  {
    id: 'indian-discount-broker',
    name: 'Indian Discount Broker (NSE/BSE)',
    description: 'SEBI-registered broker with flat ₹20/order or 0.05% brokerage for F&O and equity delivery.',
    assetClassSupport: ['indian_stocks', 'indian_derivatives'],
    defaultCommission: { type: 'flat', value: 20 },
    defaultMargin: { type: 'percentage', value: 20 },
  },
];
