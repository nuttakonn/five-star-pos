import { BaseSheetsRepository } from '../../shared/repositories/base-sheets.repository';
import { SHEETS } from '../../shared/constants/sheets.constants';

export interface SalesItemEntity {
  billNumber: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  subTotal: number;
}

export class SalesItemsRepository extends BaseSheetsRepository<SalesItemEntity> {
  protected sheetName = SHEETS.SALES_ITEMS;
  protected columns: (keyof SalesItemEntity)[] = [
    'billNumber',
    'productId',
    'quantity',
    'unitPrice',
    'costPrice',
    'subTotal',
  ];

  async saveItems(items: SalesItemEntity[]): Promise<void> {
    for (const item of items) {
      await this.append(item);
    }
  }
}
