import { BaseSheetsRepository } from '../../shared/repositories/base-sheets.repository';
import { SHEETS } from '../../shared/constants/sheets.constants';

export interface StockMovementEntity {
  id: string;
  productId: string;
  type: 'IN' | 'OUT' | 'ADJUST';
  quantity: number;
  reason: string;
  referenceId: string; // billNumber or adjustmentId
  createdAt: string;
}

export class StockMovementRepository extends BaseSheetsRepository<StockMovementEntity> {
  protected sheetName = SHEETS.STOCK_MOVEMENTS;
  protected columns: (keyof StockMovementEntity)[] = [
    'id',
    'productId',
    'type',
    'quantity',
    'reason',
    'referenceId',
    'createdAt',
  ];

  async addMovement(movement: StockMovementEntity): Promise<void> {
    await this.append(movement);
  }
}
