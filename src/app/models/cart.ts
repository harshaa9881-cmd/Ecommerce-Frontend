
export interface AddCartItemRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartItem {
  cartItemId: number;
  productId: number;
  productName: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface CartResponse {
  cartId: number;
  items: CartItem[];
  totalAmount: number;
}