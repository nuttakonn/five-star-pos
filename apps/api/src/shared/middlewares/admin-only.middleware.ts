import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/api.error';

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (!user || user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  next();
};
