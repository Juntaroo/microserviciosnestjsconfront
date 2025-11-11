import { User } from './user.model';
import { Product } from './product.model';

export interface InvoiceItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  userId: string;
  user?: User;
  items: InvoiceItem[];
  total: number;
  createdAt: string;
}
