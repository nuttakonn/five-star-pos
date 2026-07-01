import { BaseSheetsRepository } from '../../shared/repositories/base-sheets.repository';
import { SHEETS } from '../../shared/constants/sheets.constants';

export interface ProductEntity {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  costPrice: number;
  stockQuantity: number;
  minStockLevel: number;
  updatedAt: string;
}

export class ProductRepository extends BaseSheetsRepository<ProductEntity> {
  protected sheetName = SHEETS.PRODUCT_MASTER;
  protected columns: (keyof ProductEntity)[] = [
    'id',
    'name',
    'category',
    'unitPrice',
    'costPrice',
    'stockQuantity',
    'minStockLevel',
    'updatedAt',
  ];

  async addProduct(product: ProductEntity): Promise<void> {
    await this.append(product);
  }

  async findById(id: string): Promise<ProductEntity | null> {
    return this.findOne(p => p.id === id);
  }
}
