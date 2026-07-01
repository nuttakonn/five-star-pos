import { BaseSheetsRepository } from '../../shared/repositories/base-sheets.repository';
import { SHEETS } from '../../shared/constants/sheets.constants';

export interface SalesHeaderEntity {
  billNumber: string;
  date: string;
  totalAmount: number;
  profit: number;
  paymentMethod: string;
  customerName: string;
  requestId: string;
}

export class SalesHeaderRepository extends BaseSheetsRepository<SalesHeaderEntity> {
  protected sheetName = SHEETS.SALES_HEADER;
  protected columns: (keyof SalesHeaderEntity)[] = [
    'billNumber',
    'date',
    'totalAmount',
    'profit',
    'paymentMethod',
    'customerName',
    'requestId',
  ];

  async saveHeader(header: SalesHeaderEntity): Promise<void> {
    await this.append(header);
  }

  async findByRequestId(requestId: string): Promise<SalesHeaderEntity | null> {
    return this.findOne(h => h.requestId === requestId);
  }

  async getLastBillNumber(): Promise<string | null> {
    const rows = await this.getAll();
    if (rows.length === 0) return null;
    return rows[rows.length - 1].billNumber;
  }
}
