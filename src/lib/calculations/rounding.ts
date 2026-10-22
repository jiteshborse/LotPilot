import Decimal from 'decimal.js';

/**
 * Floors a theoretical position quantity to the nearest permitted step increment
 * using Decimal.js to prevent floating-point representation artifacts.
 * 
 * Invariant: result <= theoreticalQuantity && (result % step) == 0
 */
export function floorToStep(
  theoreticalQuantity: Decimal.Value,
  step: Decimal.Value
): Decimal {
  const t = new Decimal(theoreticalQuantity);
  const s = new Decimal(step);

  if (s.isZero() || s.isNegative() || t.isZero() || t.isNegative()) {
    return new Decimal(0);
  }

  // Integer number of permitted steps
  const steps = t.div(s).floor();
  return steps.mul(s);
}

/**
 * Determines the number of decimal places in a numeric step (e.g., 0.01 -> 2, 0.001 -> 3, 1 -> 0)
 */
export function getStepPrecision(step: Decimal.Value): number {
  const d = new Decimal(step);
  return Math.max(0, d.decimalPlaces());
}

/**
 * Formats a Decimal value respecting the step precision
 */
export function formatToStepPrecision(value: Decimal.Value, step: Decimal.Value): string {
  const val = new Decimal(value);
  const precision = getStepPrecision(step);
  return val.toFixed(precision);
}
