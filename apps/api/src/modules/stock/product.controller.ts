import { Request, Response } from 'express';
import { ProductRepository } from './product.repository';
import { StatusCodes } from 'http-status-codes';
import { getThaiISO } from '../../shared/utils/date.utils';
import { ApiError } from '../../shared/errors/api.error';

export class ProductController {
  constructor(private productRepo: ProductRepository) {}

  getAllProducts = async (req: Request, res: Response) => {
    const products = await this.productRepo.getAll();
    res.json({ success: true, data: products });
  };

  createProduct = async (req: Request, res: Response) => {
    const { id } = req.body;
    const existing = await this.productRepo.findById(id);
    if (existing) {
      throw ApiError.badRequest(`Product ID "${id}" already exists`);
    }

    const product = { ...req.body, updatedAt: getThaiISO() };
    await this.productRepo.addProduct(product);
    res.status(StatusCodes.CREATED).json({ success: true, data: product });
  };

  updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: getThaiISO() };
    await this.productRepo.update('id', id, updates);
    res.json({ success: true, data: updates });
  };

  adjustStock = async (req: Request, res: Response) => {
    const { productId, quantity, type, reason } = req.body;
    const { stockService } = await import('./stock.service');
    await stockService.adjustStock(productId, quantity, type, reason);
    res.json({ success: true, message: 'Stock adjusted successfully' });
  };
}
