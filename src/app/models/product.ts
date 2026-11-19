export interface Product {
  productId: number;
  productName: string;
  description: string | null;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  categoryId: number;
  categoryName: string;
}

export interface ProductListResponse {
  products: Product[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductRequest {
  productName: string;
  description: string | null;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  categoryId: number;
}