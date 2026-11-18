
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Product, ProductListResponse } from '../../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  getProducts(
    searchTerm: string = '',
    categoryId: number | null = null,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<ProductListResponse> {

    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (searchTerm.trim() !== '') {
      params = params.set('searchTerm', searchTerm.trim());
    }

    if (categoryId !== null) {
      params = params.set('categoryId', categoryId);
    }

    return this.http.get<ProductListResponse>(this.apiUrl, { params });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
}
