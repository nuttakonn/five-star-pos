export interface CreateSaleDTO {
  items: SaleItemDTO[];
  paymentMethod: 'cash' | 'transfer';
  totalAmount: number;
  customerName?: string;
  requestId: string; // For idempotency (retry safety)
}

export interface SaleItemDTO {
  productId: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
}

export interface SaleResponseDTO {
  billNumber: string;
  totalAmount: number;
  profit: number;
  status: string;
}
