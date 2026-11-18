
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

import { Product } from '../../../models/product';
import { ProductService } from '../../../core/services/product.service';

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
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
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
}
