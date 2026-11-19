import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Observable, finalize } from 'rxjs';
import {
  Product,
  ProductRequest,
  ProductListResponse
} from '../../../../models/product';

import { Category } from '../../../../models/category';

import { ProductService } from '../../../../core/services/product.service';
import { CategoryService } from '../../../../core/services/category.service';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './product-management.html',
  styleUrl: './product-management.css'
})
export class ProductManagement implements OnInit {

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);

  isLoading = signal(false);
  isSaving = signal(false);
  isDeleting = signal(false);

  errorMessage = signal('');
  successMessage = signal('');

  selectedProductId = signal<number | null>(null);

  productData: ProductRequest = {
    productName: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    imageUrl: '',
    categoryId: 0
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {

    this.categoryService.getCategories().subscribe({

      next: (data) => {
        this.categories.set(data);
      },

      error: (error) => {
        console.error('Error loading categories:', error);

        this.errorMessage.set(
          'Unable to load categories.'
        );
      }

    });
  }

  loadProducts(): void {

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.productService.getProducts('', null, 1, 50)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({

        next: (response: ProductListResponse) => {
          this.products.set(response.products);
        },

        error: (error) => {
          console.error('Error loading products:', error);

          this.errorMessage.set(
            'Unable to load products. Please try again.'
          );
        }

      });
  }

  saveProduct(): void {

    this.errorMessage.set('');
    this.successMessage.set('');

    const product: ProductRequest = {
      productName: this.productData.productName.trim(),
      description: this.productData.description?.trim() || null,
      price: Number(this.productData.price),
      stockQuantity: Number(this.productData.stockQuantity),
      imageUrl: this.productData.imageUrl?.trim() || null,
      categoryId: Number(this.productData.categoryId)
    };

    if (!product.productName) {
      this.errorMessage.set('Product name is required.');
      return;
    }

    if (product.price <= 0 || !Number.isFinite(product.price)) {
      this.errorMessage.set('Enter a valid product price.');
      return;
    }

    if (
      !Number.isInteger(product.stockQuantity) ||
      product.stockQuantity < 0
    ) {
      this.errorMessage.set('Stock quantity must be zero or greater.');
      return;
    }

    if (!product.categoryId || product.categoryId <= 0) {
      this.errorMessage.set('Please select a category.');
      return;
    }

    this.isSaving.set(true);

    const selectedId = this.selectedProductId();

   const request: Observable<unknown> = selectedId === null
  ? this.productService.createProduct(product)
  : this.productService.updateProduct(selectedId, product);
    request
      .pipe(
        finalize(() => {
          this.isSaving.set(false);
        })
      )
      .subscribe({

        next: () => {

          this.successMessage.set(
            selectedId === null
              ? 'Product created successfully.'
              : 'Product updated successfully.'
          );

          this.resetForm();
          this.loadProducts();
        },

        error: (error) => {

          console.error('Error saving product:', error);

          this.errorMessage.set(
            error.error?.message || 'Unable to save product.'
          );

        }

      });
  }

  editProduct(product: Product): void {

    this.selectedProductId.set(product.productId);

    this.productData = {
      productName: product.productName,
      description: product.description || '',
      price: product.price,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl || '',
      categoryId: product.categoryId
    };

    this.errorMessage.set('');
    this.successMessage.set('');
  }

  deleteProduct(id: number): void {

    const confirmed = confirm(
      'Are you sure you want to deactivate this product?'
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.isDeleting.set(true);

    this.productService.deleteProduct(id)
      .pipe(
        finalize(() => {
          this.isDeleting.set(false);
        })
      )
      .subscribe({

        next: () => {

          this.successMessage.set(
            'Product deactivated successfully.'
          );

          if (this.selectedProductId() === id) {
            this.resetForm();
          }

          this.loadProducts();
        },

        error: (error) => {

          console.error('Error deleting product:', error);

          this.errorMessage.set(
            error.error?.message || 'Unable to delete product.'
          );

        }

      });
  }

  resetForm(): void {

    this.productData = {
      productName: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      imageUrl: '',
      categoryId: 0
    };

    this.selectedProductId.set(null);
  }

}