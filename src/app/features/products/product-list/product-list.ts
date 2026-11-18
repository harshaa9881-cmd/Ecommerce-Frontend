
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { Product, ProductListResponse } from '../../../models/product';
import { ProductService } from '../../../core/services/product.service';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../core/services/category.service';
import { ProductCard } from '../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {

  // Reactive data
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);

  // Search and filter values
  searchTerm = '';
  selectedCategoryId: number | null = null;

  // Pagination
  pageNumber = signal(1);
  pageSize = 10;
  totalPages = signal(0);
  totalCount = signal(0);

  // Loading and error states
  isLoading = signal(false);
  isCategoriesLoading = signal(false);

  errorMessage = signal('');
  categoryErrorMessage = signal('');

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {

    this.isCategoriesLoading.set(true);
    this.categoryErrorMessage.set('');

    this.categoryService.getCategories()
      .pipe(
        finalize(() => {
          this.isCategoriesLoading.set(false);
        })
      )
      .subscribe({

        next: (data) => {
          this.categories.set(data);
        },

        error: (error) => {
          console.error('Error loading categories:', error);

          this.categoryErrorMessage.set(
            'Unable to load categories.'
          );
        }

      });
  }

  loadProducts(): void {

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.productService.getProducts(
      this.searchTerm,
      this.selectedCategoryId,
      this.pageNumber(),
      this.pageSize
    )
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({

        next: (response: ProductListResponse) => {

          console.log('Products API response:', response);

          this.products.set(response.products);
          this.totalCount.set(response.totalCount);
          this.totalPages.set(response.totalPages);
          this.pageNumber.set(response.pageNumber);

        },

        error: (error) => {

          console.error('Error loading products:', error);

          this.errorMessage.set(
            'Unable to load products. Please try again.'
          );

        }

      });
  }

  searchProducts(): void {
    this.pageNumber.set(1);
    this.loadProducts();
  }

  filterByCategory(): void {
    this.pageNumber.set(1);
    this.loadProducts();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategoryId = null;
    this.pageNumber.set(1);
    this.loadProducts();
  }

  viewProductDetails(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  previousPage(): void {

    if (this.pageNumber() > 1) {
      this.pageNumber.update(value => value - 1);
      this.loadProducts();
    }
  }

  nextPage(): void {

    if (this.pageNumber() < this.totalPages()) {
      this.pageNumber.update(value => value + 1);
      this.loadProducts();
    }
  }
}
