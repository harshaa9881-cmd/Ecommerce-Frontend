import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../models/order';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './order-management.html',
  styleUrls: ['./order-management.css']
})
export class OrderManagement implements OnInit {

  orders: Order[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';

  statuses = [
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled'
  ];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {

    this.orderService.getAllOrders().subscribe({

      next: (response) => {
        this.orders = response;
        this.loading = false;
      },

      error: () => {
        this.errorMessage = 'Unable to load orders.';
        this.loading = false;
      }
    });
  }

  updateStatus(orderId: number, event: Event): void {

    const status = (event.target as HTMLSelectElement).value;

    this.successMessage = '';
    this.errorMessage = '';

    this.orderService.updateOrderStatus(
      orderId,
      { orderStatus: status }
    ).subscribe({

      next: () => {
        this.successMessage = `Order #${orderId} updated successfully.`;
        this.loadOrders();
      },

      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to update order status.';
      }
    });
  }
}