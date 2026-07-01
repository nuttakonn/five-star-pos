import { google, sheets_v4 } from 'googleapis';
import { JWT } from 'google-auth-library';
import { logger } from '../logger';
import { ApiError } from '../errors/api.error';

export class GoogleSheetsService {
  private sheets: sheets_v4.Sheets;
  private spreadsheetId: string;

  constructor() {
    const rawKey = process.env.GOOGLE_PRIVATE_KEY || '';
  const formattedKey = rawKey
    .trim()
    .replace(/^['"](.*)['"]$/, '$1') // Remove potential wrapping quotes
    .replace(/\\n/g, '\n');

  const auth = new JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL?.trim(),
    key: formattedKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = process.env.GOOGLE_SHEET_ID!;
  }

  private async withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      if (retries > 0 && (error.code === 429 || error.code >= 500)) {
        logger.warn({ code: error.code, retriesLeft: retries - 1 }, 'Retrying Google API call');
        await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries)));
        return this.withRetry(fn, retries - 1);
      }
      logger.error({ 
        error: error.message, 
        details: error.response?.data?.error,
        code: error.code 
      }, 'Google API call failed');
      
      const details = error.response?.data?.error?.message || error.message;
      throw ApiError.internal(`Data source communication failed: ${details}`);
    }
  }

  async getAllRows(range: string): Promise<any[][]> {
    return this.withRetry(async () => {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range,
      });
      return response.data.values || [];
    });
  }

  async appendRow(range: string, values: any[]): Promise<void> {
    await this.withRetry(async () => {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [values],
        },
      });
    });
  }

  async updateRow(range: string, values: any[]): Promise<void> {
    await this.withRetry(async () => {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [values],
        },
      });
    });
  }

  async findRows(range: string, predicate: (row: any[]) => boolean): Promise<any[][]> {
    const rows = await this.getAllRows(range);
    return rows.filter(predicate);
  }

  async clearRange(range: string): Promise<void> {
    await this.withRetry(async () => {
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range,
      });
    });
  }

  // Google Sheets doesn't have a direct "delete row" by value, usually done by clearing or shifting.
  // For a generic deleteRow, we'd need the row index.
  async deleteRowByIndex(sheetId: number, rowIndex: number): Promise<void> {
    await this.withRetry(async () => {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId,
                dimension: 'ROWS',
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          }],
        },
      });
    });
  }

  async getSheetId(sheetName: string): Promise<number> {
    return this.withRetry(async () => {
      const spreadsheet = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });
      const sheet = spreadsheet.data.sheets?.find(
        s => s.properties?.title === sheetName
      );
      if (!sheet?.properties?.sheetId && sheet?.properties?.sheetId !== 0) {
        throw ApiError.notFound(`Sheet ${sheetName} not found`);
      }
      return sheet.properties.sheetId;
    });
  }

  async findRowIndex(sheetName: string, columnLetter: string, value: string): Promise<number> {
    const rows = await this.getAllRows(`${sheetName}!${columnLetter}:${columnLetter}`);
    const index = rows.findIndex(r => r[0] === value);
    return index !== -1 ? index + 1 : -1; // 1-based index
  }
}

export const googleSheetsService = new GoogleSheetsService();
