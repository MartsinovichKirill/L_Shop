export type Id = string;

export type User = {
  id: Id;
  name: string;
  email?: string;
  login?: string;
  phone?: string;
  passwordHash: string;
  createdAt: string;
};

export type Session = {
  id: Id;
  userId: Id;
  createdAt: string;
  expiresAt: string;
};

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

export type BasketItem = {
  productId: Id;
  qty: number;
};

export type Basket = {
  userId: Id;
  items: BasketItem[];
  updatedAt: string;
};

export type PaymentMethod = "card" | "cash";

export type DeliveryForm = {
  address: string;
  phone: string;
  email: string;
  paymentMethod: PaymentMethod;
};

export type OrderItemSnapshot = {
  productId: Id;
  title: string;
  price: number;
  qty: number;
};

export type Order = {
  id: Id;
  userId: Id;
  items: OrderItemSnapshot[];
  delivery: DeliveryForm;
  createdAt: string;
};
