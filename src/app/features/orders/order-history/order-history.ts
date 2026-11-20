import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../models/order';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.css']
})
export class OrderHistory implements OnInit {

  orders: Order[] = [];
  loading = true;
  errorMessage = '';

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {

    this.orderService.getMyOrders().subscribe({

      next: (response) => {
        this.orders = response;
        this.loading = false;
      },

      error: () => {
        this.errorMessage = 'Unable to load your orders.';
        this.loading = false;
      }
    });
  }
}