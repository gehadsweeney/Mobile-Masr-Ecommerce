export interface ICategory {
  _id: string;
  name: string;
  image?: string;
  // ...أي خصائص أخرى حسب الحاجة
}
export interface IBrand {
  _id: string;
  name: string;
  image?: string;
}
export interface IVendor {
  _id: string;
  name: string;
  phone?: string;
  address?: string;
  image?: string;
  rating?: number;
  // ...أي خصائص أخرى حسب الحاجة
}
export interface Iproduct {
  _id?: string;
  name: {
    en: string;
    ar: string;
  };
  price: number;
  discount?: number;
  skuCode: string;
  description?: {
    en?: string;
    ar?: string;
  };
  condition?: {
    en: 'new' | 'used';
    ar: 'جديد' | 'مستعمل';
  };
  storage?: string;
  ram?: string[];
  stock?: number;
  sale?: number; // عدد مرات البيع
  processor?: string;
  gpu?: string;
  hdd?: string;
  ssd?: string;
  color?: string;
  batteryCapacity?: string;
  simCard?: string;
  screenSize?: string;
  camera?: string;
  weight?: string;
  accessories?: {
    en?: string[];
    ar?: string[];
  };
  batteryStatus?: {
    en?: string;
    ar?: string;
  };
  guarantee?: {
    en?: string;
    ar?: string;
  };
  images?: string[];
  category: string | ICategory;
  brand: string | IBrand;
  vendor?: string | IVendor;
  date?: Date;
  priceAfterDiscount?: number;
}
