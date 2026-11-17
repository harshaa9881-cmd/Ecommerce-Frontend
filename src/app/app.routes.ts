
import { Routes } from '@angular/router';

import { CustomerLayout } from './features/customer/customer-layout/customer-layout';
import { AdminLayout } from './features/admin/dashboard/admin-layout/admin-layout';

export const routes: Routes = [

  {
    path: '',
    component: CustomerLayout
  },

  {
    path: 'admin',
    component: AdminLayout
  },

  {
    path: '**',
    redirectTo: ''
  }

];
