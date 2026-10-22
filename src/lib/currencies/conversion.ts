import Decimal from 'decimal.js';
import { ConversionResult, ExchangeRate } from './types';
import { DEFAULT_REFERENCE_RATES } from './reference-rates';

export class CurrencyConverter {
  private rates: Map<string, ExchangeRate> = new Map();

  constructor(customRates?: Record<string, ExchangeRate>) {
    const initialRates = { ...DEFAULT_REFERENCE_RATES, ...(customRates || {}) };
    Object.entries(initialRates).forEach(([pair, data]) => {
      this.rates.set(pair.toUpperCase(), data);
    });
  }

  public setRate(pair: string, rate: number, source: 'manual_override' | 'live_provider' = 'manual_override') {
    const normalizedPair = pair.toUpperCase();
    const parts = normalizedPair.split('/');
    if (parts.length === 2) {
      this.rates.set(normalizedPair, {
        pair: normalizedPair,
        baseCurrency: parts[0],
        quoteCurrency: parts[1],
        rate,
        source,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Calculates the conversion multiplier to convert an amount in `fromCurrency` into `toCurrency`.
   * e.g., result * amountInFromCurrency = amountInToCurrency.
   */
  public getConversion(
    fromCurrency: string,
    toCurrency: string,
    manualRateOverride?: number | string,
    contextPairRate?: { pair: string; rate: number }
  ): ConversionResult {
    const from = fromCurrency.toUpperCase();
    const to = toCurrency.toUpperCase();

    // Identical currency: 1:1
    if (from === to) {
      return {
        fromCurrency: from,
        toCurrency: to,
        rate: '1',
        multiplier: '1',
        path: 'Direct Identity (1:1)',
        source: 'identity',
        timestamp: Date.now(),
      };
    }

    // Manual override specified by user for this exact conversion
    if (manualRateOverride !== undefined && manualRateOverride !== null && manualRateOverride !== '') {
      const manualDecimal = new Decimal(manualRateOverride);
      if (!manualDecimal.isZero() && !manualDecimal.isNegative()) {
        return {
          fromCurrency: from,
          toCurrency: to,
          rate: manualDecimal.toString(),
          multiplier: manualDecimal.toString(),
          path: `Manual Override (${from}/${to} = ${manualDecimal.toString()})`,
          source: 'manual_override',
          timestamp: Date.now(),
        };
      }
    }

    // Context Pair Rate (e.g. trading USD/CHF and converting CHF quote profit to USD account)
    if (contextPairRate) {
      const [ctxBase, ctxQuote] = contextPairRate.pair.toUpperCase().split('/');
      const ctxRateDecimal = new Decimal(contextPairRate.rate);
      
      if (ctxBase === from && ctxQuote === to) {
        return {
          fromCurrency: from,
          toCurrency: to,
          rate: ctxRateDecimal.toString(),
          multiplier: ctxRateDecimal.toString(),
          path: `Active Instrument Market Rate (${ctxBase}/${ctxQuote} = ${ctxRateDecimal.toString()})`,
          source: 'context_market_rate',
          timestamp: Date.now(),
        };
      }
      
      if (ctxBase === to && ctxQuote === from) {
        // e.g. from CHF to USD, where context pair is USD/CHF
        const inv = new Decimal(1).div(ctxRateDecimal);
        return {
          fromCurrency: from,
          toCurrency: to,
          rate: ctxRateDecimal.toString(),
          multiplier: inv.toString(),
          path: `Active Instrument Inverse Rate (1 / [${ctxBase}/${ctxQuote} @ ${ctxRateDecimal.toString()}])`,
          source: 'context_market_rate',
          timestamp: Date.now(),
        };
      }
    }

    // 1. Direct pair match: FROM/TO
    const directKey = `${from}/${to}`;
    if (this.rates.has(directKey)) {
      const r = this.rates.get(directKey)!;
      const dec = new Decimal(r.rate);
      return {
        fromCurrency: from,
        toCurrency: to,
        rate: dec.toString(),
        multiplier: dec.toString(),
        path: `Direct Pair (${directKey} = ${dec.toString()})`,
        source: r.source,
        timestamp: r.timestamp,
      };
    }

    // 2. Inverse pair match: TO/FROM
    const inverseKey = `${to}/${from}`;
    if (this.rates.has(inverseKey)) {
      const r = this.rates.get(inverseKey)!;
      const dec = new Decimal(r.rate);
      const inv = new Decimal(1).div(dec);
      return {
        fromCurrency: from,
        toCurrency: to,
        rate: dec.toString(),
        multiplier: inv.toString(),
        path: `Inverse Pair (1 / [${inverseKey} @ ${dec.toString()}])`,
        source: r.source,
        timestamp: r.timestamp,
      };
    }

    // 3. Cross conversion through USD
    if (from !== 'USD' && to !== 'USD') {
      try {
        const fromToUsd = this.getConversion(from, 'USD');
        const usdToTarget = this.getConversion('USD', to);
        
        const combinedMultiplier = new Decimal(fromToUsd.multiplier).mul(new Decimal(usdToTarget.multiplier));
        return {
          fromCurrency: from,
          toCurrency: to,
          rate: combinedMultiplier.toString(),
          multiplier: combinedMultiplier.toString(),
          path: `Cross via USD (${fromToUsd.path} -> ${usdToTarget.path})`,
          source: 'usd_cross',
          timestamp: Math.min(fromToUsd.timestamp, usdToTarget.timestamp),
        };
      } catch {
        // Fall through to error
      }
    }

    throw new Error(
      `No conversion rate found between ${from} and ${to}. Please enter a custom exchange rate.`
    );
  }
}

export const defaultConverter = new CurrencyConverter();
