import { Routes } from '@angular/router';

import { CustomerLayout } from './features/customer/customer-layout/customer-layout';
import { AdminLayout } from './features/admin/dashboard/admin-layout/admin-layout';

import { CategoryList } from './features/categories/category-list/category-list';
import { CategoryManagement } from './features/admin/category-management/category-management';

import { CartPage } from './features/cart/cart-page/cart-page';

import { ProductList } from './features/products/product-list/product-list';
import { ProductDetails } from './features/products/product-details/product-details';

import { Checkout } from './features/orders/checkout/checkout';
import { OrderConfirmation } from './features/orders/order-confirmation/order-confirmation';
import { OrderHistory } from './features/orders/order-history/order-history';
import { OrderManagement } from './features/admin/order-management/order-management';

import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { customerGuard } from './core/guards/customer.guard';

import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { ProductManagement } from './features/admin/product-management/product-management/product-management';
export const routes: Routes = [

  {
    path: '',
    component: CustomerLayout
  },

  {
    path: 'categories',
    component: CategoryList
  },

  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [adminGuard],
    children: [
      {
        path: 'categories',
        component: CategoryManagement
      },
    {
      path: 'products',
      component: ProductManagement
    },
    {
      path: 'orders',
      component: OrderManagement
    },
    {
      path: 'checkout',
      component: Checkout,
      canActivate: [customerGuard]
    },
    {
      path: 'order-confirmation/:id',
      component: OrderConfirmation,
      canActivate: [customerGuard]
    },
    {
      path: 'orders',
      component: OrderHistory,
      canActivate: [customerGuard]
    }
    ]
  },
  {
    path: 'products',
    component: ProductList
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'products/:id',
    component: ProductDetails
  },
  {
    path: 'cart',
    component: CartPage,
    canActivate: [customerGuard]
  },

  {
    path: '**',
    redirectTo: ''
  }

];