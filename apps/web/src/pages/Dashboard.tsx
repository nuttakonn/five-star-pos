import { 
  TrendingUp, 
  DollarSign, 
  Package,
  ArrowUpRight,
  AlertCircle,
  BarChart3,
  Download
} from "lucide-react"
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis,
  Tooltip
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSummary, useProducts, useSalesHistory } from "@/hooks/useDashboard"
import React, { useState } from "react"
import { format, differenceInDays, isAfter, parseISO } from "date-fns"
import { downloadCSV } from "@/lib/export"

export default function Dashboard() {
  const [customRange, setCustomRange] = useState({
    start: format(new Date(), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });

  const { start, end } = customRange;
  const { data: summaryData, isLoading: summaryLoading } = useSummary(start, end);
  const { data: productsData, isLoading: productsLoading } = useProducts();
  const { data: historyData } = useSalesHistory(start, end);

  const validateAndSetRange = (newRange: { start: string, end: string }) => {
    const startDate = parseISO(newRange.start);
    const endDate = parseISO(newRange.end);
    const today = new Date();

    if (isAfter(startDate, today) || isAfter(endDate, today)) {
      alert("ไม่สามารถเลือกวันที่ในอนาคตได้ครับ (Cannot select future dates)");
      return;
    }

    if (differenceInDays(endDate, startDate) > 30) {
      alert("กรุณาเลือกช่วงเวลาไม่เกิน 30 วันครับ (Range must be 30 days or less)");
      return;
    }

    if (isAfter(startDate, endDate)) {
      alert("วันที่เริ่มต้นต้องก่อนวันที่สิ้นสุดครับ (Start date must be before end date)");
      return;
    }

    setCustomRange(newRange);
  };

  const handleExport = () => {
    if (!historyData || historyData.length === 0) {
      alert("ไม่พบข้อมูลในช่วงที่เลือกครับ (No data found for export)");
      return;
    }

    const reportData = historyData.map((sale: any) => ({
      'Bill Number': sale.billNumber,
      'Date': sale.date,
      'Customer': sale.customerName,
      'Method': sale.paymentMethod,
      'Total Amount': sale.totalAmount,
      'Profit': sale.profit
    }));

    downloadCSV(reportData, `FiveStarPOS_Report_${start}_to_${end}`);
  };

  if (summaryLoading || productsLoading) return <div className="p-8 text-center text-muted-foreground">Loading dashboard analytics...</div>;

  const activeSummary = summaryData?.range || { totalSales: 0, totalProfit: 0, totalTransactions: 0, totalItemsSold: 0 };
  const chartData = summaryData?.chartData || [];
  const topProducts = summaryData?.topProducts || [];
  
  const lowStockProducts = productsData?.filter((p: any) => Number(p.stockQuantity) <= Number(p.minStockLevel)) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Real-time overview of your store performance.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Selection Only */}
          <div className="flex items-center gap-2 bg-background p-1 border rounded-lg">
            <span className="text-[10px] uppercase font-bold text-muted-foreground px-2">Filter</span>
            <input 
              type="date" 
              className="text-xs bg-transparent outline-none px-2 h-8"
              value={customRange.start}
              max={format(new Date(), 'yyyy-MM-dd')}
              onChange={(e) => validateAndSetRange({ ...customRange, start: e.target.value })}
            />
            <span className="text-muted-foreground">-</span>
            <input 
              type="date" 
              className="text-xs bg-transparent outline-none px-2 h-8"
              value={customRange.end}
              max={format(new Date(), 'yyyy-MM-dd')}
              onChange={(e) => validateAndSetRange({ ...customRange, end: e.target.value })}
            />
          </div>

          <Button size="sm" className="h-8 gap-2" onClick={handleExport}>
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{Number(activeSummary.totalSales || 0).toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {activeSummary.totalTransactions || 0} transactions in range
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">฿{Number(activeSummary.totalProfit || 0).toLocaleString()}</div>
            <div className="flex items-center text-[10px] text-green-500 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              Calculated from costs
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Units Sold Today</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData?.today?.totalItemsSold || 0}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Total quantity sold today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productsData?.length || 0}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Items in inventory</p>
          </CardContent>
        </Card>
        <Card className={lowStockProducts.length > 0 ? "border-red-200 bg-red-50/50 md:col-span-2 lg:col-span-1" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-xs font-bold uppercase tracking-wider ${lowStockProducts.length > 0 ? "text-red-600" : "text-muted-foreground"}`}>Stock Alerts</CardTitle>
            <AlertCircle className={`h-4 w-4 ${lowStockProducts.length > 0 ? "text-red-600" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${lowStockProducts.length > 0 ? "text-red-700" : ""}`}>{lowStockProducts.length} Items</div>
            <p className={`text-[10px] ${lowStockProducts.length > 0 ? "text-red-600" : "text-muted-foreground"} mt-1`}>Below minimum levels</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Revenue trend for the selected period</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `฿${value}`}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar 
                    dataKey="total" 
                    fill="currentColor" 
                    radius={[4, 4, 0, 0]} 
                    className="fill-primary" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Top 5 Best Sellers</CardTitle>
            <CardDescription>Most sold items by quantity</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical" margin={{ left: 30, right: 30 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar 
                    dataKey="quantity" 
                    fill="#3b82f6" 
                    radius={[0, 4, 4, 0]} 
                    label={{ position: 'right', fontSize: 10, fill: '#666' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Stock Action Needed</CardTitle>
            <CardDescription>Items that need to be refilled</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">All stock levels are optimal.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {lowStockProducts.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between border p-3 rounded-lg">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{item.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-red-600">{item.stockQuantity} Left</p>
                        <p className="text-[10px] uppercase text-muted-foreground font-bold">Min: {item.minStockLevel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
