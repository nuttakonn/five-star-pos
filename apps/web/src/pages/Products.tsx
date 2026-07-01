import React, { useState } from 'react';
import { useProducts, useAddProduct, useAdjustStock, useUpdateProduct } from '../hooks/useDashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Products() {
  const { data: products, isLoading } = useProducts();
  const addProductMutation = useAddProduct();
  const adjustStockMutation = useAdjustStock();
  const updateProductMutation = useUpdateProduct();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [adjustingProduct, setAdjustingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    id: '', name: '', category: '', unitPrice: '', costPrice: '', stockQuantity: '', minStockLevel: ''
  });
  const [editData, setEditData] = useState({ unitPrice: '', costPrice: '' });
  const [adjustData, setAdjustData] = useState({ quantity: '', type: 'IN', reason: 'Restock' });

  const handleToggleAdd = () => {
    if (!isAdding) {
      // Auto-generate ID: Find highest P-XXX and increment
      let nextId = 'P-001';
      if (products && products.length > 0) {
        const pIds = products
          .map((p: any) => p.id)
          .filter((id: string) => id && id.startsWith('P-'))
          .map((id: string) => {
            const parts = id.split('-');
            return parts.length > 1 ? parseInt(parts[1]) : 0;
          })
          .filter((num: number) => !isNaN(num));
        
        if (pIds.length > 0) {
          const maxId = Math.max(...pIds);
          nextId = `P-${String(maxId + 1).padStart(3, '0')}`;
        }
      }
      setFormData({ id: nextId, name: '', category: '', unitPrice: '', costPrice: '', stockQuantity: '', minStockLevel: '' });
    }
    setIsAdding(!isAdding);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProductMutation.mutate({
      ...formData,
      unitPrice: Number(formData.unitPrice),
      costPrice: Number(formData.costPrice),
      stockQuantity: Number(formData.stockQuantity),
      minStockLevel: Number(formData.minStockLevel),
    }, {
      onSuccess: () => {
        setIsAdding(false);
        setFormData({ id: '', name: '', category: '', unitPrice: '', costPrice: '', stockQuantity: '', minStockLevel: '' });
      }
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProductMutation.mutate({
      id: editingProduct.id,
      updates: {
        unitPrice: Number(editData.unitPrice),
        costPrice: Number(editData.costPrice),
      }
    }, {
      onSuccess: () => {
        setEditingProduct(null);
      }
    });
  };

  const handleAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    adjustStockMutation.mutate({
      productId: adjustingProduct.id,
      quantity: Number(adjustData.quantity),
      type: adjustData.type,
      reason: adjustData.reason,
    }, {
      onSuccess: () => {
        setAdjustingProduct(null);
        setAdjustData({ quantity: '', type: 'IN', reason: 'Restock' });
      }
    });
  };

  if (isLoading) return <div className="p-8 text-center">Loading products...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
        <Button onClick={handleToggleAdd}>{isAdding ? 'Cancel' : 'Add Product'}</Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Product ID (Auto)</label>
                <input 
                  className="w-full border p-2 rounded bg-muted font-mono" 
                  readOnly 
                  required 
                  value={formData.id} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Name</label>
                <input 
                  placeholder="e.g. Fried Chicken" 
                  className="w-full border p-2 rounded" 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Category</label>
                <input 
                  placeholder="e.g. Food" 
                  className="w-full border p-2 rounded" 
                  required 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Unit Price (฿)</label>
                <input 
                  placeholder="0.00" 
                  type="number" 
                  className="w-full border p-2 rounded" 
                  required 
                  value={formData.unitPrice} 
                  onChange={e => setFormData({...formData, unitPrice: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Cost Price (฿)</label>
                <input 
                  placeholder="0.00" 
                  type="number" 
                  className="w-full border p-2 rounded" 
                  required 
                  value={formData.costPrice} 
                  onChange={e => setFormData({...formData, costPrice: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Initial Stock</label>
                <input 
                  placeholder="0" 
                  type="number" 
                  className="w-full border p-2 rounded" 
                  required 
                  value={formData.stockQuantity} 
                  onChange={e => setFormData({...formData, stockQuantity: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Min Stock Alert</label>
                <input 
                  placeholder="5" 
                  type="number" 
                  className="w-full border p-2 rounded" 
                  required 
                  value={formData.minStockLevel} 
                  onChange={e => setFormData({...formData, minStockLevel: e.target.value})} 
                />
              </div>
              <Button type="submit" disabled={addProductMutation.isPending} className="col-span-2 py-6 text-lg font-bold">
                {addProductMutation.isPending ? 'Saving...' : 'Save Product'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {editingProduct && (
        <Card className="border-blue-500">
          <CardHeader>
            <CardTitle>Edit Pricing: {editingProduct.name}</CardTitle>
            <CardDescription>Update selling price and cost for this product.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEditSubmit} className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Selling Price (฿)</label>
                <input type="number" className="w-full border p-2 rounded" required value={editData.unitPrice} onChange={e => setEditData({...editData, unitPrice: e.target.value})} />
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Cost Price (฿)</label>
                <input type="number" className="w-full border p-2 rounded" required value={editData.costPrice} onChange={e => setEditData({...editData, costPrice: e.target.value})} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={updateProductMutation.isPending}>
                  {updateProductMutation.isPending ? 'Saving...' : 'Update Price'}
                </Button>
                <Button variant="ghost" type="button" onClick={() => setEditingProduct(null)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {adjustingProduct && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Adjust Stock: {adjustingProduct.name}</CardTitle>
            <CardDescription>Update current inventory levels for this item.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdjust} className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Type</label>
                <select className="w-full border p-2 rounded" value={adjustData.type} onChange={e => setAdjustData({...adjustData, type: e.target.value})}>
                  <option value="IN">Add Stock (+)</option>
                  <option value="OUT">Remove Stock (-)</option>
                </select>
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Quantity</label>
                <input type="number" className="w-full border p-2 rounded" required value={adjustData.quantity} onChange={e => setAdjustData({...adjustData, quantity: e.target.value})} />
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Reason</label>
                <input placeholder="e.g. New Shipment" className="w-full border p-2 rounded" value={adjustData.reason} onChange={e => setAdjustData({...adjustData, reason: e.target.value})} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={adjustStockMutation.isPending}>
                  {adjustStockMutation.isPending ? 'Saving...' : 'Confirm'}
                </Button>
                <Button variant="ghost" type="button" onClick={() => setAdjustingProduct(null)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Inventory List</CardTitle>
          <CardDescription>Manage your store's products and stock levels.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted text-muted-foreground">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Cost</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product: any) => {
                  const isLow = Number(product.stockQuantity) <= Number(product.minStockLevel);
                  return (
                    <tr key={product.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium">{product.id}</td>
                      <td className="px-6 py-4">{product.name}</td>
                      <td className="px-6 py-4">{product.category}</td>
                      <td className="px-6 py-4 font-bold text-blue-600">฿{product.unitPrice}</td>
                      <td className="px-6 py-4 text-muted-foreground">฿{product.costPrice}</td>
                      <td className={`px-6 py-4 font-bold ${isLow ? 'text-red-600' : ''}`}>
                        {product.stockQuantity}
                        {isLow && <span className="ml-2 bg-red-100 text-red-800 px-2 py-1 rounded text-[10px] uppercase">Low</span>}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          setEditingProduct(product);
                          setEditData({ unitPrice: product.unitPrice, costPrice: product.costPrice });
                          setAdjustingProduct(null);
                        }}>Edit Price</Button>
                        <Button variant="outline" size="sm" onClick={() => {
                          setAdjustingProduct(product);
                          setEditingProduct(null);
                        }}>Adjust Stock</Button>
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
