import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Category, CategoryRequest } from '../../models/category';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  createCategory(category: CategoryRequest): Observable<Category> {
    return this.http.post<Category>(
      this.apiUrl,
      category,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  updateCategory(
    id: number,
    category: CategoryRequest
  ): Observable<Category> {
    return this.http.put<Category>(
      `${this.apiUrl}/${id}`,
      category,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      { headers: this.authService.getAuthHeaders() }
    );
  }
}