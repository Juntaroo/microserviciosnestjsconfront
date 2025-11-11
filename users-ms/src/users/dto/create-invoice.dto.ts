export interface InvoiceItemDto {
  productId: string;
  descripcion: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateInvoiceDto {
  numero: string;
  userId: string;
  total: number;
  items: InvoiceItemDto[];
}