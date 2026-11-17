import { Component, OnInit } from '@angular/core';

import { Category } from '../../../models/category';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css'
})
export class CategoryList implements OnInit {

  categories: Category[] = [];

  isLoading = false;

  errorMessage = '';

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.categoryService.getCategories().subscribe({

      next: (response) => {
        this.categories = response;
        this.isLoading = false;
      },

      error: (error) => {
        console.error('Error loading categories:', error);

        this.errorMessage = 'Unable to load categories. Please try again.';

        this.isLoading = false;
      }

    });
  }
}