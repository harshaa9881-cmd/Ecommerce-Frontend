
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

import { Product } from '../../../models/product';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {

  product: Product | null = null;

  isLoading = false;
  isAddingToCart = false;

  errorMessage = '';
  cartMessage = '';
  cartErrorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id || id <= 0) {
      this.errorMessage = 'Invalid product ID.';
      return;
    }

    this.loadProduct(id);
  }

  loadProduct(id: number): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProductById(id).subscribe({

      next: (data) => {
        this.product = data;
        this.isLoading = false;
      },

      error: () => {
        this.errorMessage = 'Product not found or unable to load product.';
        this.isLoading = false;
      }

    });
  }

  addToCart(): void {

    if (!this.product || this.product.stockQuantity <= 0) {
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.isAddingToCart = true;
    this.cartMessage = '';
    this.cartErrorMessage = '';

    this.cartService.addItem({
      productId: this.product.productId,
      quantity: 1
    }).subscribe({

      next: () => {
        this.isAddingToCart = false;
        this.cartMessage = 'Product added to your cart.';
      },

      error: (error) => {
        console.error('Error adding product to cart:', error);

        this.isAddingToCart = false;
        this.cartErrorMessage =
          error.error?.message ||
          'Unable to add this product to your cart. Please check available stock.';
      }

    });
  }
}