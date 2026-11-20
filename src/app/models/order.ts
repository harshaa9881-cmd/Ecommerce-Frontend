export interface OrderItem {
  orderItemId: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  orderId: number;
  userId: number;
  orderDate: string;
  totalAmount: number;
  orderStatus: string;
  paymentMethod: string;
  items: OrderItem[];
}

export interface UpdateOrderStatusRequest {
  orderStatus: string;
}