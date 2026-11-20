
import { Component, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { CartItem, CartResponse } from '../../../models/cart';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css'
})
export class CartPage implements OnInit {

  cart = signal<CartResponse | null>(null);

  isLoading = signal(false);
  isUpdating = signal(false);
  updatingItemId = signal<number | null>(null);

  errorMessage = signal('');
  successMessage = signal('');

  isLoggedIn = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    if (this.isLoggedIn) {
      this.loadCart();
    }
  }

  loadCart(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.cartService.getCart()
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({

        next: (data) => {
          this.cart.set(data);
        },

        error: (error) => {
          console.error('Error loading cart:', error);
          this.errorMessage.set(
            'Unable to load your cart. Please try again.'
          );
        }

      });
  }

  updateQuantity(item: CartItem, change: number): void {

    const newQuantity = item.quantity + change;

    if (newQuantity < 1) {
      return;
    }

    this.isUpdating.set(true);
    this.updatingItemId.set(item.cartItemId);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.cartService.updateItem(
      item.cartItemId,
      { quantity: newQuantity }
    )
      .pipe(
        finalize(() => {
          this.isUpdating.set(false);
          this.updatingItemId.set(null);
        })
      )
      .subscribe({

        next: (data) => {
          this.cart.set(data);
          this.successMessage.set('Cart quantity updated.');
        },

        error: (error) => {
          console.error('Error updating cart item:', error);

          this.errorMessage.set(
            error.error?.message ||
            'Unable to update quantity. Please check available stock.'
          );
        }

      });
  }

  getTotalItems(): number {
    return this.cart()?.items.reduce(
      (total, item) => total + item.quantity,
      0
    ) ?? 0;
  }
  
  removeItem(itemId: number): void {

    this.errorMessage.set('');
    this.successMessage.set('');

    this.cartService.removeItem(itemId).subscribe({

      next: () => {
        this.cart.set(this.cartService.getCurrentCart());
        this.successMessage.set('Item removed from cart.');
      },

      error: (error) => {
        console.error('Error removing cart item:', error);

        this.errorMessage.set(
          'Unable to remove item. Please try again.'
        );
      }

    });
  }
}