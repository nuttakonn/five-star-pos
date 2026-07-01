import { Request, Response } from 'express';
import { SalesService } from './sales.service';
import { CreateSaleDTO } from './sales.dto';
import { StatusCodes } from 'http-status-codes';

export class SalesController {
  constructor(private salesService: SalesService) {}

  createSale = async (req: Request, res: Response) => {
    const dto: CreateSaleDTO = req.body;
    const result = await this.salesService.createSale(dto);
    
    res.status(StatusCodes.CREATED).json({
      success: true,
      data: result,
    });
  };
}
