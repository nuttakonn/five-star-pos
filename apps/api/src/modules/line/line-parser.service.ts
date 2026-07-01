export interface ParsedCommand {
  type: 'SALE' | 'STOCK_CHECK' | 'SUMMARY_TODAY' | 'SUMMARY_MONTH' | 'UNKNOWN';
  payload?: any;
}

export class LineParserService {
  parse(text: string): ParsedCommand {
    const trimmedText = text.trim();

    // 1. Multi-Item Sale Command: "ขาย [item1] [qty1] [item2] [qty2] ..."
    if (trimmedText.startsWith('ขาย')) {
      const content = trimmedText.replace(/^ขาย\s*/, '').trim();
      // Match "Product Name" followed by "Quantity"
      // We look for sequences of text followed by numbers
      const matches = Array.from(content.matchAll(/(.+?)\s+(\d+)(?:\s+|$)/g));
      
      if (matches.length > 0) {
        const items = matches.map(m => ({
          productName: m[1].trim(),
          quantity: parseInt(m[2]),
        }));
        return {
          type: 'SALE',
          payload: { items },
        };
      }
    }

    // 2. Stock Command: "stock"
    if (trimmedText.toLowerCase() === 'stock') {
      return { type: 'STOCK_CHECK' };
    }

    // 3. Summary Commands
    const lowerText = trimmedText.toLowerCase();
    if (lowerText === 'summary today') {
      return { type: 'SUMMARY_TODAY' };
    }
    if (lowerText === 'summary month') {
      return { type: 'SUMMARY_MONTH' };
    }

    return { type: 'UNKNOWN' };
  }
}

export const lineParserService = new LineParserService();
