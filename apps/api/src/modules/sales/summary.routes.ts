import { Router } from 'express';
import { SummaryController } from './summary.controller';
import { DailySummaryRepository } from './daily-summary.repository';
import { SalesItemsRepository } from './sales-items.repository';
import { ProductRepository } from '../stock/product.repository';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const router = Router();
const summaryRepo = new DailySummaryRepository();
const itemsRepo = new SalesItemsRepository();
const productRepo = new ProductRepository();
const summaryController = new SummaryController(summaryRepo, itemsRepo, productRepo);

router.get('/', authMiddleware, summaryController.getSummary);

export const summaryRoutes = router;
