export type Id = string;

export type Category = "boardgames" | "cards" | "accessories" | "merch";

export type Product = {
  id: Id;
  title: string;
  description: string;
  price: number;
  category: Category;
  available: boolean;
  imageUrl?: string;
};

export type User = {
  id: Id;
  name: string;
  email?: string;
  login?: string;
  phone?: string;
  createdAt: string;
};

export type BasketLine = {
  product: Product;
  qty: number;
  lineTotal: number;
};

export type BasketResponse = {
  items: BasketLine[];
  total: number;
};

export type PaymentMethod = "card" | "cash";

export type Order = {
  id: Id;
  userId: Id;
  items: Array<{ productId: Id; title: string; price: number; qty: number }>;
  delivery: { address: string; phone: string; email: string; paymentMethod: PaymentMethod };
  createdAt: string;
};
