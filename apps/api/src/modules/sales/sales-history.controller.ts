import { Request, Response } from 'express';
import { SalesHeaderRepository } from './sales-header.repository';

export class SalesHistoryController {
  constructor(private headerRepo: SalesHeaderRepository) {}

  getAllSales = async (req: Request, res: Response) => {
    const { start, end } = req.query;
    const sales = await this.headerRepo.getAll();
    
    let filteredSales = sales;
    if (start && end) {
      filteredSales = sales.filter(s => {
        const saleDate = s.date.slice(0, 10);
        return saleDate >= String(start) && saleDate <= String(end);
      });
    }

    // Return sorted by date descending (newest first)
    const sortedSales = filteredSales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json({ success: true, data: sortedSales });
  };
}
