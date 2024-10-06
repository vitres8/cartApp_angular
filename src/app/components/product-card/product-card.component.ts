import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { Product } from '../../models/product';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {

  @Input() product!: Product;

  @Output() productEventEmitter: EventEmitter<Product> = new EventEmitter();

  onAddCart(product: Product){
    this.productEventEmitter.emit(product);
  }
}
