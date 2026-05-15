import { Routes } from '@angular/router';
import { Login } from './Components/login/login';
import { Layout } from './Components/layout/layout';
import { Dashboard } from './Components/DashboardComponents/dashboard/dashboard';
import { Products } from './Components/ProductComponents/products/products';
import { OrderListComponent } from './Components/OrderComponents/order-list/order-list';
import { OrderDetailsComponent } from './Components/OrderComponents/order-details/order-details';
import { Users } from './Components/UserComponents/users/users';
import { Vendors } from './Components/VendorComponents/vendors/vendors';
import { Categories } from './Components/CategoryComponents/categories/categories';
import { Brands } from './Components/BrandComponents/brands/brands';
import { NotFound } from './Components/not-found/not-found';
import { AddProduct } from './Components/ProductComponents/AddProductComponents/add-product/add-product';
import { AddVendor } from './Components/VendorComponents/add-vendor/add-vendor';
import { AddCategory } from './Components/CategoryComponents/add-category/add-category';
import { AddBrand } from './Components/BrandComponents/add-brand/add-brand';
import { Reviews } from './Components/ReviewComponents/reviews/reviews';
import { adminGuard } from './guards/admin-guard';
import { AdminSettings } from './Components/admin-settings/admin-settings';
import { ProductDetails } from './Components/ProductComponents/product-details/product-details';
import { AdminAIComponents } from './Components/admin-aicomponents/admin-aicomponents';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login, title: 'Login' },
  {
    path: 'admin',
    component: Layout,
    canActivateChild: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard, title: 'Dashboard' },
      { path: 'products', component: Products, title: 'Products' },
      { path: 'products/add', component: AddProduct, title: 'Add Product' },
      { path: 'products/edit/:id', component: AddProduct, title: 'Edit Product' },
      { path: 'products/details/:id', component: ProductDetails, title: 'Product Details' },
      { path: 'orders', component: OrderListComponent, title: 'Orders' },
      { path: 'orders/:id', component: OrderDetailsComponent, title: 'Order Details' },
      { path: 'users', component: Users, title: 'Users' },
      { path: 'vendors', component: Vendors, title: 'Vendors' },
      { path: 'vendors/add', component: AddVendor, title: 'Add Vendor' },
      { path: 'vendors/edit/:id', component: AddVendor, title: 'Edit Vendor' },
      { path: 'categories', component: Categories, title: 'Categories' },
      { path: 'categories/add', component: AddCategory, title: 'Add Category' },
      { path: 'brands', component: Brands, title: 'Brands' },
      { path: 'brands/add', component: AddBrand, title: 'Add Brand' },
      { path: 'brands/edit/:id', component: AddBrand, title: 'Edit Brand' },

      { path: 'reviews', component: Reviews, title: 'Reviews' },
      { path: 'ai-chat', component: AdminAIComponents, title: 'AI Analytics' },
      { path: 'settings', component: AdminSettings, title: 'Settings' },
    ],
  },
  { path: '**', component: NotFound, title: 'Not Found' },
];
