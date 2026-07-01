/**
 * Robustly convert a value (often a string from Google Sheets) to a number.
 * Handles currency symbols, commas, and other non-numeric formatting.
 */
export const toSafeNumber = (val: any): number => {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return val;
  
  // Convert to string and remove everything except digits, decimal points, and minus signs
  const cleaned = String(val).replace(/[^0-9.-]+/g, '');
  const num = parseFloat(cleaned);
  
  return isNaN(num) ? 0 : num;
};
