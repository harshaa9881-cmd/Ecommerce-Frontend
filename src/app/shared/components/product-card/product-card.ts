
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { Product } from '../../../models/product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {

  @Input() product!: Product;

  @Output() viewDetails = new EventEmitter<number>();

  onViewDetails(): void {
    this.viewDetails.emit(this.product.productId);
  }
}
