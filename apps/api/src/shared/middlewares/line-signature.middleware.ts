import { Request, Response, NextFunction } from 'express';
import { validateSignature } from '@line/bot-sdk';
import { logger } from '../logger';
import { ApiError } from '../errors/api.error';

export const lineSignatureMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const signature = req.headers['x-line-signature'] as string;
  const channelSecret = process.env.LINE_CHANNEL_SECRET!;

  if (!signature) {
    throw ApiError.badRequest('Missing LINE signature');
  }

  // Use the raw body buffer captured in server.ts for signature validation
  const body = (req as any).rawBody;
  
  if (!body || !validateSignature(body.toString(), channelSecret, signature)) {
    logger.warn('Invalid LINE signature detected');
    throw new ApiError(401, 'Invalid signature');
  }

  next();
};
