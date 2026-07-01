import { Router } from 'express';
import { LineWebhookController } from './line.controller';
import { lineSignatureMiddleware } from '../../shared/middlewares/line-signature.middleware';

const router = Router();
const lineController = new LineWebhookController();

// Use raw body for LINE signature verification if needed
// For now assuming express.json() is fine or will be handled in server.ts
router.post(
  '/webhook',
  lineSignatureMiddleware,
  lineController.handleWebhook
);

export const lineRoutes = router;
