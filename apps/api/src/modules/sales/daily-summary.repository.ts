import { BaseSheetsRepository } from '../../shared/repositories/base-sheets.repository';
import { SHEETS } from '../../shared/constants/sheets.constants';

export interface DailySummaryEntity {
  date: string;
  totalSales: number;
  totalProfit: number;
  totalTransactions: number;
  totalItemsSold: number;
  updatedAt: string;
}

export class DailySummaryRepository extends BaseSheetsRepository<DailySummaryEntity> {
  protected sheetName = SHEETS.DAILY_SUMMARY;
  protected columns: (keyof DailySummaryEntity)[] = [
    'date',
    'totalSales',
    'totalProfit',
    'totalTransactions',
    'totalItemsSold',
    'updatedAt',
  ];

  async updateDailySummary(summary: DailySummaryEntity): Promise<void> {
    const existing = await this.findOne(s => s.date === summary.date);
    if (existing) {
      // Find row index for update
      const rows = await this.sheetsService.getAllRows(`${this.sheetName}!A:A`);
      const rowIndex = rows.findIndex(r => r[0] === summary.date) + 1; // 1-based index
      await this.sheetsService.updateRow(`${this.sheetName}!A${rowIndex}:F${rowIndex}`, this.mapObjectToRow(summary));
    } else {
      await this.append(summary);
    }
  }
}
