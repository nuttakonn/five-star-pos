import { SalesService } from './sales.service';
import { SalesHeaderRepository } from './sales-header.repository';
import { SalesItemsRepository } from './sales-items.repository';
import { DailySummaryRepository } from './daily-summary.repository';
import { stockService } from '../stock/stock.service';

jest.mock('../stock/stock.service', () => ({
  stockService: {
    deductStock: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('SalesService', () => {
  let salesService: SalesService;
  let mockHeaderRepo: jest.Mocked<SalesHeaderRepository>;
  let mockItemsRepo: jest.Mocked<SalesItemsRepository>;
  let mockSummaryRepo: jest.Mocked<DailySummaryRepository>;

  beforeEach(() => {
    mockHeaderRepo = {
      saveHeader: jest.fn().mockResolvedValue(undefined),
      findByRequestId: jest.fn().mockResolvedValue(null),
      getLastBillNumber: jest.fn().mockResolvedValue(null),
    } as any;
    
    mockItemsRepo = {
      saveItems: jest.fn().mockResolvedValue(undefined),
    } as any;

    mockSummaryRepo = {
      findOne: jest.fn().mockResolvedValue(null),
      updateDailySummary: jest.fn().mockResolvedValue(undefined),
    } as any;

    salesService = new SalesService(mockHeaderRepo, mockItemsRepo, mockSummaryRepo);
  });

  it('should create a sale successfully and calculate profit correctly', async () => {
    const dto = {
      items: [
        { productId: 'P1', quantity: 2, unitPrice: 100, costPrice: 70 },
        { productId: 'P2', quantity: 1, unitPrice: 200, costPrice: 150 },
      ],
      paymentMethod: 'cash' as const,
      totalAmount: 400,
      requestId: 'req-1',
    };

    const result = await salesService.createSale(dto);

    expect(result.billNumber).toMatch(/^BILL-\d{8}-0001$/);
    expect(result.profit).toBe(60 + 50); 
    expect(mockHeaderRepo.saveHeader).toHaveBeenCalled();
    expect(mockItemsRepo.saveItems).toHaveBeenCalled();
    expect(mockSummaryRepo.updateDailySummary).toHaveBeenCalled();
    expect(stockService.deductStock).toHaveBeenCalledTimes(2);
  });

  it('should return existing sale if duplicate requestId is provided', async () => {
    const existingSale = {
      billNumber: 'BILL-20240514-0001',
      totalAmount: 400,
      profit: 110,
      requestId: 'req-1',
    };
    mockHeaderRepo.findByRequestId.mockResolvedValue(existingSale as any);

    const dto = {
      items: [],
      paymentMethod: 'cash' as const,
      totalAmount: 400,
      requestId: 'req-1',
    };

    const result = await salesService.createSale(dto);

    expect(result.status).toBe('EXISTING');
    expect(result.billNumber).toBe(existingSale.billNumber);
    expect(mockHeaderRepo.saveHeader).not.toHaveBeenCalled();
  });
});

