import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Order, UpdateOrderStatusRequest } from '../../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }

  placeOrder(): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, {});
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/my`);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  updateOrderStatus(
    id: number,
    data: UpdateOrderStatusRequest
  ): Observable<Order> {
    return this.http.put<Order>(
      `${this.apiUrl}/${id}/status`,
      data
    );
  }
}