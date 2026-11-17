import { Routes } from '@angular/router';

import { CustomerLayout } from './features/customer/customer-layout/customer-layout';
import { AdminLayout } from './features/admin/dashboard/admin-layout/admin-layout';

import { CategoryList } from './features/categories/category-list/category-list';
import { CategoryManagement } from './features/admin/category-management/category-management';

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
    children: [
      {
        path: 'categories',
        component: CategoryManagement
      }
    ]
  },

  {
    path: '**',
    redirectTo: ''
  }

];