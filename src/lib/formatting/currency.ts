/**
 * Formats a numeric value or string as currency using Intl.NumberFormat
 */
export function formatCurrency(
  value: number | string,
  currency: string = 'USD',
  minimumFractionDigits: number = 2,
  maximumFractionDigits: number = 2
): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return `${currency} 0.00`;

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(num);
  } catch {
    // Fallback for custom or non-standard ISO symbols like USDT
    return `${currency.toUpperCase()} ${num.toLocaleString('en-US', {
      minimumFractionDigits,
      maximumFractionDigits,
    })}`;
  }
}

/**
 * Formats a plain decimal number with grouped thousands and precision
 */
export function formatNumber(
  value: number | string,
  minDecimals: number = 2,
  maxDecimals: number = 2
): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0.00';

  return num.toLocaleString('en-US', {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals,
  });
}
