import { Request, Response } from 'express';
import { DailySummaryRepository } from './daily-summary.repository';
import { SalesItemsRepository } from './sales-items.repository';
import { ProductRepository } from '../stock/product.repository';
import { getThaiDate } from '../../shared/utils/date.utils';
import { toSafeNumber } from '../../shared/utils/number.utils';

export class SummaryController {
  constructor(
    private summaryRepo: DailySummaryRepository,
    private itemsRepo: SalesItemsRepository,
    private productRepo: ProductRepository
  ) {}

  getSummary = async (req: Request, res: Response) => {
    const { start, end } = req.query;
    
    const [summaries, salesItems, allProducts] = await Promise.all([
      this.summaryRepo.getAll(),
      this.itemsRepo.getAll(),
      this.productRepo.getAll()
    ]);
    
    // Process summaries for dashboard
    const today = getThaiDate();
    
    // Filter summaries by range if provided
    let filteredSummaries = summaries;
    if (start && end) {
      filteredSummaries = summaries.filter(s => s.date >= String(start) && s.date <= String(end));
    }

    const rangeSummary = filteredSummaries.reduce((acc, s) => ({
      totalSales: acc.totalSales + toSafeNumber(s.totalSales),
      totalProfit: acc.totalProfit + toSafeNumber(s.totalProfit),
      totalTransactions: acc.totalTransactions + toSafeNumber(s.totalTransactions),
      totalItemsSold: acc.totalItemsSold + toSafeNumber(s.totalItemsSold)
    }), { totalSales: 0, totalProfit: 0, totalTransactions: 0, totalItemsSold: 0 });

    const todaySummary = summaries.find(s => s.date === today) || { 
      totalSales: 0, 
      totalProfit: 0, 
      totalTransactions: 0,
      totalItemsSold: 0
    };
    
    // Sort by date ascending for trend chart (last 7 days by default, or all in range)
    const chartData = (start && end ? filteredSummaries : summaries.slice(-7)).map(s => ({
        name: s.date.slice(5), // MM-DD
        total: toSafeNumber(s.totalSales)
    }));

    // Aggregate Top Products (Best Sellers)
    const productAgg: Record<string, number> = {};
    salesItems.forEach(item => {
      productAgg[item.productId] = (productAgg[item.productId] || 0) + toSafeNumber(item.quantity);
    });

    const topProducts = Object.entries(productAgg)
      .map(([productId, quantity]) => {
        const product = allProducts.find(p => p.id === productId);
        return {
          name: product ? product.name : productId,
          quantity
        };
      })
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        today: todaySummary,
        range: rangeSummary,
        chartData,
        topProducts
      }
    });
  };
}
