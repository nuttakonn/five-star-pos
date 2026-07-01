import { Router } from 'express';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { StockMovementController } from './stock-movement.controller';
import { StockMovementRepository } from './stock-movement.repository';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const router = Router();
const productRepo = new ProductRepository();
const productController = new ProductController(productRepo);
const movementRepo = new StockMovementRepository();
const movementController = new StockMovementController(movementRepo);

router.get('/', authMiddleware, productController.getAllProducts);
router.post('/', authMiddleware, productController.createProduct);
router.patch('/:id', authMiddleware, productController.updateProduct);
router.post('/adjust', authMiddleware, productController.adjustStock);

// Stock Movement Route
router.get('/movements', authMiddleware, movementController.getAllMovements);

export const productRoutes = router;
