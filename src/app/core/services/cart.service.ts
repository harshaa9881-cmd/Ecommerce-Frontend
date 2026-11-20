
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  AddCartItemRequest,
  CartResponse,
  UpdateCartItemRequest
} from '../../models/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = `${environment.apiUrl}/cart`;

  private cartSubject = new BehaviorSubject<CartResponse | null>(null);
  cart$ = this.cartSubject.asObservable();

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();
    getCurrentCart(): CartResponse | null {
    return this.cartSubject.value;
    }
  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('ecommerceToken');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  private updateCartState(cart: CartResponse): void {
    this.cartSubject.next(cart);

    const count = cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );

    this.cartCountSubject.next(count);
  }

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(
      this.apiUrl,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(cart => this.updateCartState(cart))
    );
  }

  addItem(data: AddCartItemRequest): Observable<CartResponse> {
    return this.http.post<CartResponse>(
      `${this.apiUrl}/items`,
      data,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(cart => this.updateCartState(cart))
    );
  }

  updateItem(
    cartItemId: number,
    data: UpdateCartItemRequest
  ): Observable<CartResponse> {
    return this.http.put<CartResponse>(
      `${this.apiUrl}/items/${cartItemId}`,
      data,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(cart => this.updateCartState(cart))
    );
  }

  removeItem(cartItemId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/items/${cartItemId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(() => {
        const currentCart = this.cartSubject.value;

        if (currentCart) {
          const updatedItems = currentCart.items.filter(
            item => item.cartItemId !== cartItemId
          );

          const updatedCart: CartResponse = {
            ...currentCart,
            items: updatedItems,
            totalAmount: updatedItems.reduce(
              (total, item) => total + item.subtotal,
              0
            )
          };

          this.updateCartState(updatedCart);
        }
      })
    );
  }
}