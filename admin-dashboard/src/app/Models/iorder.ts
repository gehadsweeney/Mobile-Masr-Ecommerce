export interface IOrderUser {
  _id?: string;
  name?: string;
  email?: string;
}

export interface IOrderProduct {
  _id?: string;
  name?: string;
  image?: string;
  images?: string[];
}

export interface IorderItem {
  product?: IOrderProduct;
  quantity: number;
  price: number;
}

export interface IshippingAddress {
  fullName?: string;
  phone?: string;
  governorate?: string;
  city?: string;
  street?: string;
  notes?: string;
}

export interface Iorder {
  _id?: string;
  user?: IOrderUser;
  shippingAddress?: IshippingAddress;
  paymentMethod?: 'cod' | 'online' | string;
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  previousPaymentStatus?: 'pending' | 'paid' | 'refunded' | string;
  items?: IorderItem[];
  subtotal?: number;
  shippingFees?: number;
  totalPrice?: number;
  totalAmount?: number;
  orderStatus?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | string;
  previousStatus?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | string;
  createdAt?: Date | string;
}
