import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { salesRoutes } from './modules/sales/sales.routes';
import { lineRoutes } from './modules/line/line.routes';
import { productRoutes } from './modules/stock/product.routes';
import { summaryRoutes } from './modules/sales/summary.routes';
import { authRoutes } from './modules/auth/auth.routes';
import { errorMiddleware } from './shared/middlewares/error.middleware';
import { logger } from './shared/logger';
import versionInfo from './version.json';

const app = express();

app.use(cors());
app.use(express.json({
  verify: (req: any, res, buf) => {
    req.rawBody = buf;
  }
}));

// Routes
app.use('/api/sales', salesRoutes);
app.use('/api/line', lineRoutes);
app.use('/api/products', productRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/auth', authRoutes);

app.get('/health', (_, res) => {
  res.json({ 
    status: 'ok', 
    ...versionInfo
  });
});

// Error handling
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`API running on port ${PORT}`);
});
