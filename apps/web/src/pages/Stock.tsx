import { useStockMovements, useProducts } from '../hooks/useDashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight, RefreshCcw } from "lucide-react";

export default function Stock() {
  const { data: movements, isLoading: movementsLoading } = useStockMovements();
  const { data: products } = useProducts();

  if (movementsLoading) return <div className="p-8 text-center text-muted-foreground">Loading inventory movements...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Stock Movement</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory History</CardTitle>
          <CardDescription>Track every addition, deduction, and sale in your inventory.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted text-muted-foreground">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3 text-right">Quantity</th>
                  <th className="px-6 py-3">Reason</th>
                  <th className="px-6 py-3">Ref ID</th>
                </tr>
              </thead>
              <tbody>
                {movements?.map((mov: any) => {
                  const product = products?.find((p: any) => p.id === mov.productId);
                  const isIncoming = mov.type === 'IN';
                  
                  return (
                    <tr key={mov.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-muted-foreground">
                        {format(new Date(mov.createdAt.replace('+07:00', '')), 'dd MMM HH:mm')}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold">{product?.name || mov.productId}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{mov.productId}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit uppercase ${
                          isIncoming ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {isIncoming ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {mov.type}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-bold \${isIncoming ? 'text-green-600' : 'text-red-600'}`}>
                        {isIncoming ? '+' : '-'}{mov.quantity}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                          {mov.reason}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[10px] text-muted-foreground font-mono">
                        {mov.referenceId}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
