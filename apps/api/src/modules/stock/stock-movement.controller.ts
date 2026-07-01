import { Request, Response } from 'express';
import { StockMovementRepository } from './stock-movement.repository';

export class StockMovementController {
  constructor(private movementRepo: StockMovementRepository) {}

  getAllMovements = async (req: Request, res: Response) => {
    const movements = await this.movementRepo.getAll();
    const sorted = movements.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ success: true, data: sorted });
  };
}
