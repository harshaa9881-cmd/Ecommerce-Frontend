export interface Category {
  categoryId: number;
  categoryName: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CategoryRequest {
  categoryName: string;
  description: string | null;
}