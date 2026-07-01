import { logger } from '../../shared/logger';
import { ProductRepository } from './product.repository';
import { StockMovementRepository } from './stock-movement.repository';
import { ApiError } from '../../shared/errors/api.error';
import { getThaiISO } from '../../shared/utils/date.utils';

export class StockService {
  private productRepo = new ProductRepository();
  private movementRepo = new StockMovementRepository();

  async deductStock(productId: string, quantity: number): Promise<void> {
    const product = await this.productRepo.findById(productId);
    
    if (!product) {
      // In a real app with many products, we might want to auto-create or log error
      logger.warn({ productId }, 'Product not found in PRODUCT_MASTER, skipping stock deduction');
      return;
    }

    const currentStock = Number(product.stockQuantity);
    if (currentStock < quantity) {
      throw ApiError.badRequest(`Insufficient stock for ${product.name}. Available: ${currentStock}`);
    }

    // Update Product Stock
    await this.productRepo.update('id', productId, {
      stockQuantity: currentStock - quantity,
      updatedAt: getThaiISO(),
    });

    // Log Movement
    await this.movementRepo.addMovement({
      id: `MOV-${Date.now()}`,
      productId,
      type: 'OUT',
      quantity,
      reason: 'SALE',
      referenceId: 'SALE-WEB-OR-LINE',
      createdAt: getThaiISO(),
    });

    logger.info({ productId, quantity }, 'Stock deducted and movement logged');
  }

  async adjustStock(productId: string, quantity: number, type: 'IN' | 'OUT', reason: string): Promise<void> {
    const product = await this.productRepo.findById(productId);
    if (!product) throw ApiError.notFound('Product not found');

    const currentStock = Number(product.stockQuantity);
    const newStock = type === 'IN' ? currentStock + quantity : currentStock - quantity;

    if (newStock < 0) throw ApiError.badRequest('Adjustment would result in negative stock');

    // Update Product
    await this.productRepo.update('id', productId, {
      stockQuantity: newStock,
      updatedAt: getThaiISO(),
    });

    // Log Movement
    await this.movementRepo.addMovement({
      id: `MOV-${Date.now()}`,
      productId,
      type,
      quantity,
      reason,
      referenceId: 'MANUAL',
      createdAt: getThaiISO(),
    });

    logger.info({ productId, type, quantity }, 'Manual stock adjustment successful');
  }
}

export const stockService = new StockService();
