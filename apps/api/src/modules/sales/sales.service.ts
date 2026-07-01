import { CreateSaleDTO, SaleResponseDTO } from './sales.dto';
import { SalesHeaderRepository, SalesHeaderEntity } from './sales-header.repository';
import { SalesItemsRepository, SalesItemEntity } from './sales-items.repository';
import { DailySummaryRepository } from './daily-summary.repository';
import { stockService } from '../stock/stock.service';
import { ApiError } from '../../shared/errors/api.error';
import { logger } from '../../shared/logger';
import { getThaiDate, getThaiISO } from '../../shared/utils/date.utils';
import { toSafeNumber } from '../../shared/utils/number.utils';

export class SalesService {
  constructor(
    private headerRepo: SalesHeaderRepository,
    private itemsRepo: SalesItemsRepository,
    private summaryRepo: DailySummaryRepository
  ) {}

  async createSale(dto: CreateSaleDTO): Promise<SaleResponseDTO> {
    // 1. Idempotency Check
    const existing = await this.headerRepo.findByRequestId(dto.requestId);
    if (existing) {
      return {
        billNumber: existing.billNumber,
        totalAmount: existing.totalAmount,
        profit: existing.profit,
        status: 'EXISTING',
      };
    }

    // 2. Business Logic
    const profit = dto.items.reduce((acc, item) => acc + (item.unitPrice - item.costPrice) * item.quantity, 0);
    const billNumber = await this.generateBillNumber();

    // 3. Transactions (Simulated since Sheets doesn't have native multi-sheet transactions)
    try {
      // 3.1 Deduct Stock
      for (const item of dto.items) {
        await stockService.deductStock(item.productId, item.quantity);
      }

      // 3.2 Save Items
      const itemEntities: SalesItemEntity[] = dto.items.map(item => ({
        billNumber,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        costPrice: item.costPrice,
        subTotal: item.unitPrice * item.quantity,
      }));
      await this.itemsRepo.saveItems(itemEntities);

      // 3.3 Save Header
      const headerEntity: SalesHeaderEntity = {
        billNumber,
        date: getThaiISO(),
        totalAmount: dto.totalAmount,
        profit,
        paymentMethod: dto.paymentMethod,
        customerName: dto.customerName || 'Walk-in',
        requestId: dto.requestId,
      };
      await this.headerRepo.saveHeader(headerEntity);

      // 3.4 Update Daily Summary
      const today = getThaiDate();
      const existingSummary = await this.summaryRepo.findOne(s => s.date === today);
      const currentItemsSold = dto.items.reduce((sum, item) => sum + toSafeNumber(item.quantity), 0);

      await this.summaryRepo.updateDailySummary({
        date: today,
        totalSales: toSafeNumber(existingSummary?.totalSales) + dto.totalAmount,
        totalProfit: toSafeNumber(existingSummary?.totalProfit) + profit,
        totalTransactions: toSafeNumber(existingSummary?.totalTransactions) + 1,
        totalItemsSold: toSafeNumber(existingSummary?.totalItemsSold) + currentItemsSold,
        updatedAt: getThaiISO(),
      });

      return {
        billNumber,
        totalAmount: dto.totalAmount,
        profit,
        status: 'CREATED',
      };
    } catch (error) {
      logger.error({ error, requestId: dto.requestId }, 'Failed to process sale');
      throw ApiError.internal('Failed to process sale. Please try again.');
    }
  }

  private async generateBillNumber(): Promise<string> {
    const lastBill = await this.headerRepo.getLastBillNumber();
    const dateStr = getThaiDate().replace(/-/g, '');
    
    let sequence = 1;
    if (lastBill && lastBill.startsWith(`BILL-${dateStr}`)) {
      const parts = lastBill.split('-');
      if (parts.length === 3) {
        sequence = parseInt(parts[2]) + 1;
      }
    }

    return `BILL-${dateStr}-${sequence.toString().padStart(4, '0')}`;
  }
}
