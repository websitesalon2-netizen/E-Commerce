/**
 * Formats a number into Indian Rupee currency format (INR / ₹)
 * Examples:
 * 499 -> ₹499
 * 1499 -> ₹1,499
 * 149999 -> ₹1,49,999
 */
export function formatINR(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }

  const rounded = Math.round(amount);
  
  // Format using standard Indian numbering system (en-IN)
  try {
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(rounded);
    return `₹${formatted}`;
  } catch {
    return `₹${rounded}`;
  }
}

/**
 * Calculates discount percentage given MRP and Selling Price
 */
export function calculateDiscount(mrp: number, price: number): number {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}
