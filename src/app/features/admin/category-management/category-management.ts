
import { Component, OnInit, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { Category, CategoryRequest } from '../../../models/category';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './category-management.html',
  styleUrl: './category-management.css'
})
export class CategoryManagement implements OnInit {

  // Reactive state
  categories = signal<Category[]>([]);

  isLoading = signal(false);
  isSaving = signal(false);
  isDeleting = signal(false);

  errorMessage = signal('');
  successMessage = signal('');

  selectedCategoryId = signal<number | null>(null);

  // Form values
  categoryName = '';
  description = '';

  // Changing this signal triggers the effect
  refreshTrigger = signal(0);

  constructor(private categoryService: CategoryService) {

    effect(() => {
      this.refreshTrigger();
      this.loadCategories();
    });

  }

  ngOnInit(): void {
    // Initial loading is handled by the effect.
  }

  loadCategories(): void {

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.categoryService.getCategories()
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({

        next: (response) => {
          this.categories.set(response);
        },

        error: (error) => {
          console.error('Error loading categories:', error);

          this.errorMessage.set(
            'Unable to load categories. Please try again.'
          );
        }

      });
  }

  saveCategory(): void {

    this.errorMessage.set('');
    this.successMessage.set('');

    const category: CategoryRequest = {
      categoryName: this.categoryName.trim(),
      description: this.description.trim() || null
    };

    if (!category.categoryName) {
      this.errorMessage.set('Category name is required.');
      return;
    }

    this.isSaving.set(true);

    const selectedId = this.selectedCategoryId();

    const request = selectedId === null
      ? this.categoryService.createCategory(category)
      : this.categoryService.updateCategory(selectedId, category);

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
              ? 'Category created successfully.'
              : 'Category updated successfully.'
          );

          this.resetForm();

          // Triggers the effect and reloads categories
          this.refreshTrigger.update(value => value + 1);
        },

        error: (error) => {

          console.error('Error saving category:', error);

          this.errorMessage.set(
            error.error?.message || 'Unable to save category.'
          );

        }

      });
  }

  editCategory(category: Category): void {

    this.selectedCategoryId.set(category.categoryId);

    this.categoryName = category.categoryName;
    this.description = category.description || '';

    this.errorMessage.set('');
    this.successMessage.set('');
  }

  deleteCategory(id: number): void {

    const confirmed = confirm(
      'Are you sure you want to delete this category?'
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.isDeleting.set(true);

    this.categoryService.deleteCategory(id)
      .pipe(
        finalize(() => {
          this.isDeleting.set(false);
        })
      )
      .subscribe({

        next: () => {

          this.successMessage.set('Category deleted successfully.');

          if (this.selectedCategoryId() === id) {
            this.resetForm();
          }

          // Triggers the effect and reloads categories
          this.refreshTrigger.update(value => value + 1);
        },

        error: (error) => {

          console.error('Error deleting category:', error);

          this.errorMessage.set(
            error.error?.message ||
            'Unable to delete category. It may have associated products.'
          );

        }

      });
  }

  resetForm(): void {

    this.categoryName = '';
    this.description = '';

    this.selectedCategoryId.set(null);
  }

}
