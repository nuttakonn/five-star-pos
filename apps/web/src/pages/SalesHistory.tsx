import { useSalesHistory } from '../hooks/useDashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { format, subDays, parseISO, isValid } from 'date-fns';
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SalesHistory() {
  const [filter, setFilter] = useState('today');

  const getRange = () => {
    const today = new Date();
    switch (filter) {
      case 'today':
        return { start: format(today, 'yyyy-MM-dd'), end: format(today, 'yyyy-MM-dd') };
      case 'yesterday':
        const yesterday = subDays(today, 1);
        return { start: format(yesterday, 'yyyy-MM-dd'), end: format(yesterday, 'yyyy-MM-dd') };
      case '30days':
        return { start: format(subDays(today, 30), 'yyyy-MM-dd'), end: format(today, 'yyyy-MM-dd') };
      default:
        return { start: undefined, end: undefined };
    }
  };

  const { start, end } = getRange();
  const { data: sales, isLoading } = useSalesHistory(start, end);

  if (isLoading) return <div className="p-8 text-center">Loading sales history...</div>;

  const formatDateSafely = (dateStr: string) => {
    try {
      // Handle Thai offset storage format
      const cleanDateStr = dateStr.replace('Z+07:00', '+07:00');
      const date = parseISO(cleanDateStr);
      return isValid(date) ? format(date, 'dd MMM yyyy HH:mm') : 'Invalid Date';
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales History</h1>
          <p className="text-muted-foreground text-sm">View and manage past transactions.</p>
        </div>

        <div className="flex items-center gap-2 bg-background p-1 border rounded-lg self-start">
          <Button 
            variant={filter === 'today' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setFilter('today')}
            className="text-xs h-8"
          >Today</Button>
          <Button 
            variant={filter === 'yesterday' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setFilter('yesterday')}
            className="text-xs h-8"
          >Yesterday</Button>
          <Button 
            variant={filter === '30days' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setFilter('30days')}
            className="text-xs h-8"
          >30 Days</Button>
          <Button 
            variant={filter === 'all' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setFilter('all')}
            className="text-xs h-8"
          >All</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>A complete list of all sales processed via LINE and Web.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted text-muted-foreground">
                <tr>
                  <th className="px-6 py-3">Bill Number</th>
                  <th className="px-6 py-3">Date & Time</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Method</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Profit</th>
                </tr>
              </thead>
              <tbody>
                {sales?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">No transactions found for this period.</td>
                  </tr>
                ) : (
                  sales?.map((sale: any) => (
                    <tr key={sale.billNumber} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-primary">{sale.billNumber}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {formatDateSafely(sale.date)}
                      </td>
                      <td className="px-6 py-4">{sale.customerName}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          sale.paymentMethod === 'cash' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {sale.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold">฿{Number(sale.totalAmount).toLocaleString()}</td>
                      <td className="px-6 py-4 text-green-600 font-medium">+฿{Number(sale.profit).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
