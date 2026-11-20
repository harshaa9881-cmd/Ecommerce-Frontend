import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { OrderService } from '../../../core/services/order.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class Checkout {

  loading = false;
  errorMessage = '';

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router
  ) { }

  placeOrder(): void {

    this.loading = true;
    this.errorMessage = '';

    this.orderService.placeOrder().subscribe({

      next: (order) => {

        this.loading = false;

        // Refresh the cart because the backend clears it after ordering.
        this.cartService.getCart().subscribe({
          error: () => { }
        });

        this.router.navigate([
          '/order-confirmation',
          order.orderId
        ]);
      },

      error: (error) => {

        this.loading = false;

        this.errorMessage =
          error.error?.message || 'Unable to place your order.';
      }
    });
  }
}