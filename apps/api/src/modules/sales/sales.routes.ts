import { Router } from 'express';
import { SalesController } from './sales.controller';
import { SalesHistoryController } from './sales-history.controller';
import { SalesService } from './sales.service';
import { SalesHeaderRepository } from './sales-header.repository';
import { SalesItemsRepository } from './sales-items.repository';
import { DailySummaryRepository } from './daily-summary.repository';
import { validate } from '../../shared/middlewares/validation.middleware';
import { createSaleSchema } from './sales.schema';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const router = Router();

// Dependency Injection
const headerRepo = new SalesHeaderRepository();
const itemsRepo = new SalesItemsRepository();
const summaryRepo = new DailySummaryRepository();
const salesService = new SalesService(headerRepo, itemsRepo, summaryRepo);
const salesController = new SalesController(salesService);
const historyController = new SalesHistoryController(headerRepo);

router.post(
  '/',
  authMiddleware,
  validate(createSaleSchema),
  salesController.createSale
);

router.get('/history', authMiddleware, historyController.getAllSales);

export const salesRoutes = router;
