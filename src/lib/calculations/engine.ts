import Decimal from 'decimal.js';
import {
  CalculationInputs,
  CalculationResult,
  RewardToRiskCalculation,
  InstrumentSpecification,
} from './types';
import { floorToStep, formatToStepPrecision } from './rounding';
import { CurrencyConverter, defaultConverter } from '../currencies/conversion';

export class CalculationEngine {
  private converter: CurrencyConverter;

  constructor(converter: CurrencyConverter = defaultConverter) {
    this.converter = converter;
  }

  /**
   * Main calculation entrypoint.
   */
  public calculate(inputs: CalculationInputs): CalculationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const assumptions: string[] = [];
    const now = Date.now();

    const {
      instrument,
      direction,
      entryPrice,
      stopLossPrice,
      takeProfitPrice,
      riskMode,
      riskCashAmount,
      accountEquity,
      riskPercentage,
      accountCurrency,
      customExchangeRate,
      spread,
      slippage,
      commissionPerUnit,
    } = inputs;

    // 1. Validate numeric prices
    if (entryPrice === '' || entryPrice === undefined || entryPrice === null) {
      errors.push('Entry price is required.');
    }
    if (stopLossPrice === '' || stopLossPrice === undefined || stopLossPrice === null) {
      errors.push('Stop-loss price is required.');
    }

    let entryDec = new Decimal(0);
    let stopDec = new Decimal(0);

    try {
      entryDec = new Decimal(entryPrice);
      if (entryDec.isNegative() || entryDec.isZero()) {
        errors.push('Entry price must be greater than zero.');
      }
    } catch {
      errors.push('Entry price must be a valid numeric value.');
    }

    try {
      stopDec = new Decimal(stopLossPrice);
      if (stopDec.isNegative() || stopDec.isZero()) {
        errors.push('Stop-loss price must be greater than zero.');
      }
    } catch {
      errors.push('Stop-loss price must be a valid numeric value.');
    }

    // 2. Validate Trade Direction vs Stop Loss
    if (errors.length === 0) {
      if (direction === 'long' && stopDec.gte(entryDec)) {
        errors.push('For a Long position, Stop-Loss price must be strictly BELOW the Entry price.');
      } else if (direction === 'short' && stopDec.lte(entryDec)) {
        errors.push('For a Short position, Stop-Loss price must be strictly ABOVE the Entry price.');
      }
    }

    // 3. Compute Risk Budget
    let riskBudgetDec = new Decimal(0);
    if (riskMode === 'fixed_cash') {
      if (!riskCashAmount || new Decimal(riskCashAmount).lte(0)) {
        errors.push('Fixed cash risk amount must be greater than 0.');
      } else {
        riskBudgetDec = new Decimal(riskCashAmount);
      }
    } else {
      if (!accountEquity || new Decimal(accountEquity).lte(0)) {
        errors.push('Account balance/equity must be greater than 0 for percentage risk calculation.');
      }
      if (!riskPercentage || new Decimal(riskPercentage).lte(0)) {
        errors.push('Risk percentage must be greater than 0%.');
      }
      if (errors.length === 0) {
        const equity = new Decimal(accountEquity!);
        const pct = new Decimal(riskPercentage!);
        riskBudgetDec = equity.mul(pct).div(100);
        assumptions.push(
          `Risk budget derived as ${pct.toString()}% of ${accountCurrency} ${equity.toString()} = ${accountCurrency} ${riskBudgetDec.toFixed(2)}`
        );
      }
    }

    // If initial validation fails, return empty error state
    if (errors.length > 0) {
      return this.createErrorResult(inputs, errors, warnings, assumptions, now);
    }

    // 4. Validate Instrument Specification Requirements
    this.validateInstrumentSpec(instrument, errors, warnings, assumptions);
    if (errors.length > 0) {
      return this.createErrorResult(inputs, errors, warnings, assumptions, now);
    }

    // 5. Calculate Stop Distance and Units
    const distanceDec = entryDec.sub(stopDec).abs();
    const stopDistancePct = distanceDec.div(entryDec).mul(100);

    let stopLossDistanceDisplay = distanceDec.toString();
    let stopLossDistancePipsOrTicks = distanceDec.toString();
    let stopLossDistanceUnit: 'pips' | 'points' | 'ticks' | 'dollars' | 'currency' = 'currency';

    if (instrument.assetClass === 'forex' && instrument.pipSize) {
      const pipSizeDec = new Decimal(instrument.pipSize);
      const pipsDec = distanceDec.div(pipSizeDec);
      stopLossDistanceDisplay = `${pipsDec.toFixed(1)} pips`;
      stopLossDistancePipsOrTicks = pipsDec.toFixed(1);
      stopLossDistanceUnit = 'pips';
    } else if (instrument.payoffModel === 'point_value' && instrument.valuePerPoint) {
      stopLossDistanceDisplay = `${distanceDec.toFixed(2)} pts`;
      stopLossDistancePipsOrTicks = distanceDec.toFixed(2);
      stopLossDistanceUnit = 'points';
    } else if (instrument.tickSize && instrument.tickValue) {
      const tickSizeDec = new Decimal(instrument.tickSize);
      const ticksDec = distanceDec.div(tickSizeDec);
      stopLossDistanceDisplay = `${ticksDec.toFixed(0)} ticks (${distanceDec.toString()})`;
      stopLossDistancePipsOrTicks = ticksDec.toFixed(0);
      stopLossDistanceUnit = 'ticks';
    } else {
      stopLossDistanceDisplay = `${distanceDec.toString()} ${instrument.quoteCurrency}`;
      stopLossDistancePipsOrTicks = distanceDec.toString();
      stopLossDistanceUnit = 'currency';
    }

    // 6. Calculate Loss per Single Unit / Lot in Instrument Quote/Profit Currency
    let lossPerUnitQuote = new Decimal(0);

    if (instrument.payoffModel === 'inverse') {
      // Inverse contract formula:
      // Contract face value is instrument.contractSize in quote currency (e.g. $1 USD).
      // Loss in quote currency (e.g. USD) = contractSize * abs(stop - entry) / entry
      const cSize = new Decimal(instrument.contractSize || 1);
      lossPerUnitQuote = distanceDec.div(entryDec).mul(cSize);
      assumptions.push('Payoff calculated using inverse cryptocurrency specification formula.');
    } else if (instrument.payoffModel === 'point_value' && instrument.valuePerPoint) {
      // Point-based CFD/Index: distance in points * value per point per contract
      lossPerUnitQuote = distanceDec.mul(new Decimal(instrument.valuePerPoint));
      assumptions.push(
        `Point value model: ${distanceDec.toString()} points × ${instrument.profitCurrency} ${instrument.valuePerPoint}/pt`
      );
    } else if (instrument.payoffModel === 'tick_value' && instrument.tickSize && instrument.tickValue) {
      // Tick-based contract: (distance / tickSize) * tickValue
      const ticks = distanceDec.div(new Decimal(instrument.tickSize));
      lossPerUnitQuote = ticks.mul(new Decimal(instrument.tickValue));
      assumptions.push(
        `Tick valuation model: ${ticks.toString()} ticks × ${instrument.tickValueCurrency || instrument.profitCurrency} ${instrument.tickValue}/tick`
      );
    } else if (instrument.assetClass === 'options') {
      // Option premium model: premium movement * contract multiplier
      const multiplier = instrument.contractMultiplier || 100;
      lossPerUnitQuote = distanceDec.mul(multiplier);
      assumptions.push(
        `Option premium model: Premium delta ${distanceDec.toString()} × ${multiplier} contract multiplier`
      );
      if (direction === 'short') {
        warnings.push(
          'Short option caution: Theoretical stop-loss risk does not account for overnight gap risk or volatility spikes.'
        );
      }
    } else {
      // Standard linear model: distance * contractSize
      const cSize = new Decimal(instrument.contractSize || 1);
      lossPerUnitQuote = distanceDec.mul(cSize);
      assumptions.push(
        `Linear loss model: ${distanceDec.toString()} price distance × ${cSize.toString()} contract size`
      );
    }

    if (lossPerUnitQuote.isZero()) {
      errors.push('Calculated loss per unit is zero. Please check price distance.');
      return this.createErrorResult(inputs, errors, warnings, assumptions, now);
    }

    // 7. Currency Conversion from Profit Currency to Account Currency
    let conversionMultiplier = new Decimal(1);
    let conversionPath = 'Direct Identity (1:1)';

    // Valuation currency of the lossPerUnitQuote
    // For inverse contracts, lossPerUnitQuote is denominated in quoteCurrency (e.g. USD)
    const quoteLossCurrency = (instrument.payoffModel === 'tick_value' && instrument.tickValueCurrency)
      ? instrument.tickValueCurrency
      : instrument.quoteCurrency;

    try {
      // Check if trading pair is base/quote relating to conversion
      const contextRate = (instrument.baseCurrency && instrument.quoteCurrency)
        ? { pair: `${instrument.baseCurrency}/${instrument.quoteCurrency}`, rate: entryDec.toNumber() }
        : undefined;

      const conversion = this.converter.getConversion(
        quoteLossCurrency,
        accountCurrency,
        customExchangeRate,
        contextRate
      );

      conversionMultiplier = new Decimal(conversion.multiplier);
      conversionPath = conversion.path;
      assumptions.push(`Currency conversion (${quoteLossCurrency} -> ${accountCurrency}): ${conversionPath}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Currency conversion error: ${msg}`);
      return this.createErrorResult(inputs, errors, warnings, assumptions, now);
    }

    // Loss per lot/contract in Account Currency
    const lossPerUnitAccount = lossPerUnitQuote.mul(conversionMultiplier);

    // 8. Calculate Theoretical Quantity
    const theoreticalQuantity = riskBudgetDec.div(lossPerUnitAccount);

    // 9. Permitted Quantity Floor Rounding
    // Check if exchangeLotSize applies (e.g. NIFTY futures = 25 shares/lot)
    const effectiveStep = (instrument.assetClass !== 'options' && instrument.exchangeLotSize)
      ? new Decimal(instrument.exchangeLotSize)
      : new Decimal(instrument.quantityStep || 1);

    const permittedQuantity = floorToStep(theoreticalQuantity, effectiveStep);

    // Step precision formatting
    const quantityUnit = this.getQuantityUnit(instrument);

    // 10. Check constraints
    if (permittedQuantity.lt(new Decimal(instrument.minimumQuantity || 0))) {
      warnings.push(
        `Calculated position size (${permittedQuantity.toString()} ${quantityUnit}) is below minimum broker order size (${instrument.minimumQuantity} ${quantityUnit}). Order cannot be executed without exceeding risk budget.`
      );
    }

    if (instrument.maximumQuantity && permittedQuantity.gt(new Decimal(instrument.maximumQuantity))) {
      warnings.push(
        `Calculated position size exceeds maximum broker limit (${instrument.maximumQuantity} ${quantityUnit}).`
      );
    }

    // 11. Gross Estimated Risk
    const grossEstimatedRisk = permittedQuantity.mul(lossPerUnitAccount);

    // Ensure golden invariant: grossEstimatedRisk <= riskBudgetDec
    if (grossEstimatedRisk.gt(riskBudgetDec)) {
      // Invariant violated: safety clamp
      warnings.push('Safety warning: Quantity adjusted to ensure zero risk budget overrun.');
    }

    // 12. Transaction Costs (Commission, Spread, Slippage)
    let spreadCost = new Decimal(0);
    let slippageCost = new Decimal(0);
    let commissionCost = new Decimal(0);

    const cSize = new Decimal(instrument.contractSize || 1);
    const cMultiplier = new Decimal(instrument.contractMultiplier || 1);

    if (spread && new Decimal(spread).gt(0)) {
      const spreadDec = new Decimal(spread);
      if (instrument.pipSize) {
        // spread in pips
        const spreadDistance = spreadDec.mul(new Decimal(instrument.pipSize));
        spreadCost = permittedQuantity.mul(spreadDistance).mul(cSize).mul(cMultiplier).mul(conversionMultiplier);
      } else {
        spreadCost = permittedQuantity.mul(spreadDec).mul(cSize).mul(cMultiplier).mul(conversionMultiplier);
      }
    }

    if (slippage && new Decimal(slippage).gt(0)) {
      const slippageDec = new Decimal(slippage);
      if (instrument.pipSize) {
        const slippageDistance = slippageDec.mul(new Decimal(instrument.pipSize));
        slippageCost = permittedQuantity.mul(slippageDistance).mul(cSize).mul(cMultiplier).mul(conversionMultiplier);
      } else {
        slippageCost = permittedQuantity.mul(slippageDec).mul(cSize).mul(cMultiplier).mul(conversionMultiplier);
      }
    }

    if (commissionPerUnit && new Decimal(commissionPerUnit).gt(0)) {
      commissionCost = permittedQuantity.mul(new Decimal(commissionPerUnit));
    } else if (instrument.commissionConfiguration) {
      const { type, value } = instrument.commissionConfiguration;
      const valDec = new Decimal(value);
      if (type === 'per_lot' || type === 'per_share') {
        commissionCost = permittedQuantity.mul(valDec);
      } else if (type === 'percentage_notional') {
        const notionalEst = permittedQuantity.mul(cSize).mul(cMultiplier).mul(entryDec).mul(conversionMultiplier);
        commissionCost = notionalEst.mul(valDec).div(100);
      } else if (type === 'flat') {
        commissionCost = valDec;
      }
    }

    const allInEstimatedRisk = grossEstimatedRisk.add(spreadCost).add(slippageCost).add(commissionCost);

    // Risk budget usage percentage
    const riskBudgetUsagePercent = riskBudgetDec.isZero()
      ? '0.00'
      : grossEstimatedRisk.div(riskBudgetDec).mul(100).toFixed(2);

    // 13. Notional Exposure and Estimated Margin
    const contractMultiplier = instrument.contractMultiplier || 1;
    const contractSize = instrument.contractSize || 1;
    const totalUnits = permittedQuantity.mul(new Decimal(contractSize)).mul(new Decimal(contractMultiplier));
    const notionalInQuote = totalUnits.mul(entryDec);
    const notionalInAccount = notionalInQuote.mul(conversionMultiplier);

    let estimatedMargin = new Decimal(0);
    if (instrument.marginConfiguration) {
      const { type, value } = instrument.marginConfiguration;
      const mVal = new Decimal(value);
      if (type === 'leverage' && !mVal.isZero()) {
        estimatedMargin = notionalInAccount.div(mVal);
      } else if (type === 'percentage') {
        estimatedMargin = notionalInAccount.mul(mVal).div(100);
      }
    } else if (instrument.assetClass === 'us_stocks' || instrument.assetClass === 'indian_stocks') {
      // Cash shares default 100% margin (1:1 cash requirement)
      estimatedMargin = notionalInAccount;
      assumptions.push('Cash equity: 100% initial capital requirement assumed.');
    }

    // 14. Optional Risk / Reward Calculation
    let rewardToRisk: RewardToRiskCalculation | undefined;
    if (takeProfitPrice !== undefined && takeProfitPrice !== null && takeProfitPrice !== '') {
      try {
        const tpDec = new Decimal(takeProfitPrice);
        if (direction === 'long' && tpDec.lte(entryDec)) {
          warnings.push('For a Long position, Take-Profit price should be above the Entry price.');
        } else if (direction === 'short' && tpDec.gte(entryDec)) {
          warnings.push('For a Short position, Take-Profit price should be below the Entry price.');
        } else {
          const targetDistDec = tpDec.sub(entryDec).abs();
          
          let targetGainPerUnitQuote = new Decimal(0);
          if (instrument.payoffModel === 'inverse') {
            targetGainPerUnitQuote = targetDistDec.div(entryDec).mul(cSize);
          } else if (instrument.payoffModel === 'point_value' && instrument.valuePerPoint) {
            targetGainPerUnitQuote = targetDistDec.mul(new Decimal(instrument.valuePerPoint));
          } else if (instrument.payoffModel === 'tick_value' && instrument.tickSize && instrument.tickValue) {
            const ticks = targetDistDec.div(new Decimal(instrument.tickSize));
            targetGainPerUnitQuote = ticks.mul(new Decimal(instrument.tickValue));
          } else if (instrument.assetClass === 'options') {
            const multiplier = instrument.contractMultiplier || 100;
            targetGainPerUnitQuote = targetDistDec.mul(multiplier);
          } else {
            targetGainPerUnitQuote = targetDistDec.mul(cSize);
          }

          const potentialGrossReward = permittedQuantity.mul(targetGainPerUnitQuote).mul(conversionMultiplier);
          
          let targetDisplay = `${targetDistDec.toString()}`;
          if (instrument.assetClass === 'forex' && instrument.pipSize) {
            targetDisplay = `${targetDistDec.div(new Decimal(instrument.pipSize)).toFixed(1)} pips`;
          }

          const rrRatio = distanceDec.isZero()
            ? '0.00'
            : targetDistDec.div(distanceDec).toFixed(2);

          const allInReward = potentialGrossReward.sub(commissionCost).sub(spreadCost).sub(slippageCost);
          const allInRRRatio = allInEstimatedRisk.isZero()
            ? '0.00'
            : allInReward.div(allInEstimatedRisk).toFixed(2);

          rewardToRisk = {
            targetDistance: targetDistDec.toString(),
            targetDistanceDisplay: targetDisplay,
            potentialGrossReward: potentialGrossReward.toFixed(2),
            potentialAllInReward: allInReward.toFixed(2),
            rewardToRiskRatio: `1:${rrRatio}`,
            allInRewardToRiskRatio: `1:${allInRRRatio}`,
          };
        }
      } catch {
        warnings.push('Invalid Take-Profit price entered.');
      }
    }

    // Specification provenance notes
    if (instrument.specificationSource === 'illustrative_example') {
      warnings.push('Instrument specifications are illustrative defaults. Verify broker contract size and tick value.');
    } else if (instrument.specificationSource === 'user_configured') {
      assumptions.push('Custom user-defined contract specifications applied.');
    }

    return {
      isValid: true,
      errors: [],
      warnings,
      assumptions,
      riskBudget: riskBudgetDec.toFixed(2),
      accountCurrency,
      direction,
      entryPrice: entryDec.toString(),
      stopLossPrice: stopDec.toString(),
      stopLossDistance: distanceDec.toString(),
      stopLossDistanceDisplay,
      stopLossDistancePipsOrTicks,
      stopLossDistanceUnit,
      stopLossPercentage: stopDistancePct.toFixed(2),
      theoreticalQuantity: theoreticalQuantity.toFixed(6),
      permittedQuantity: formatToStepPrecision(permittedQuantity, effectiveStep),
      quantityUnit,
      stepIncrement: effectiveStep.toString(),
      lossPerUnitQuote: lossPerUnitQuote.toFixed(6),
      lossPerUnitAccount: lossPerUnitAccount.toFixed(6),
      profitCurrency: instrument.profitCurrency || instrument.quoteCurrency,
      conversionRateApplied: conversionMultiplier.toString(),
      conversionPath,
      grossEstimatedRisk: grossEstimatedRisk.toFixed(2),
      estimatedCommissionCost: commissionCost.toFixed(2),
      estimatedSpreadCost: spreadCost.toFixed(2),
      estimatedSlippageCost: slippageCost.toFixed(2),
      allInEstimatedRisk: allInEstimatedRisk.toFixed(2),
      riskBudgetUsagePercent,
      notionalExposure: notionalInAccount.toFixed(2),
      estimatedMargin: estimatedMargin.gt(0) ? estimatedMargin.toFixed(2) : 'N/A',
      rewardToRisk,
      instrumentId: instrument.id,
      instrumentSymbol: instrument.symbol,
      assetClass: instrument.assetClass,
      specificationSource: instrument.specificationSource,
      calculatedAt: now,
    };
  }

  private validateInstrumentSpec(
    spec: InstrumentSpecification,
    errors: string[],
    _warnings: string[],
    _assumptions: string[]
  ): void {
    if (!spec.symbol) {
      errors.push('Instrument symbol is required.');
    }
    if (spec.payoffModel === 'point_value' && (!spec.valuePerPoint || spec.valuePerPoint <= 0)) {
      errors.push('Value per point is missing for point-based instrument.');
    }
    if (spec.payoffModel === 'tick_value' && (!spec.tickValue || spec.tickValue <= 0 || !spec.tickSize)) {
      errors.push('Tick size and tick value are required for tick-based instrument.');
    }
    if (!spec.quoteCurrency) {
      errors.push('Instrument quote currency is required.');
    }
    if (!spec.quantityStep || spec.quantityStep <= 0) {
      errors.push('Instrument quantity step increment must be greater than zero.');
    }
  }

  private getQuantityUnit(spec: InstrumentSpecification): string {
    switch (spec.assetClass) {
      case 'forex':
      case 'precious_metals':
      case 'commodities':
        return 'lots';
      case 'us_stocks':
      case 'indian_stocks':
        return 'shares';
      case 'crypto_spot':
        return 'coins';
      case 'crypto_derivatives':
      case 'indices':
      case 'futures':
        return 'contracts';
      case 'indian_derivatives':
        return spec.exchangeLotSize ? `shares (${spec.exchangeLotSize}/lot)` : 'contracts';
      case 'options':
        return 'contracts';
      default:
        return 'units';
    }
  }

  private createErrorResult(
    inputs: CalculationInputs,
    errors: string[],
    warnings: string[],
    assumptions: string[],
    now: number
  ): CalculationResult {
    return {
      isValid: false,
      errors,
      warnings,
      assumptions,
      riskBudget: inputs.riskCashAmount ? String(inputs.riskCashAmount) : '0.00',
      accountCurrency: inputs.accountCurrency,
      direction: inputs.direction,
      entryPrice: String(inputs.entryPrice || 0),
      stopLossPrice: String(inputs.stopLossPrice || 0),
      stopLossDistance: '0',
      stopLossDistanceDisplay: '0',
      stopLossDistancePipsOrTicks: '0',
      stopLossDistanceUnit: 'currency',
      stopLossPercentage: '0.00',
      theoreticalQuantity: '0',
      permittedQuantity: '0',
      quantityUnit: 'units',
      stepIncrement: '1',
      lossPerUnitQuote: '0',
      lossPerUnitAccount: '0',
      profitCurrency: inputs.instrument.profitCurrency || inputs.instrument.quoteCurrency || 'USD',
      conversionRateApplied: '1',
      conversionPath: 'None',
      grossEstimatedRisk: '0.00',
      estimatedCommissionCost: '0.00',
      estimatedSpreadCost: '0.00',
      estimatedSlippageCost: '0.00',
      allInEstimatedRisk: '0.00',
      riskBudgetUsagePercent: '0.00',
      notionalExposure: '0.00',
      estimatedMargin: '0.00',
      instrumentId: inputs.instrument.id,
      instrumentSymbol: inputs.instrument.symbol,
      assetClass: inputs.instrument.assetClass,
      specificationSource: inputs.instrument.specificationSource,
      calculatedAt: now,
    };
  }
}

export const defaultEngine = new CalculationEngine();
