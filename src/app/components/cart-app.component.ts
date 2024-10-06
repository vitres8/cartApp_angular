import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { CatalogComponent } from './catalog/catalog.component';
import { CartItem } from '../models/cartItem';
import { NavbarComponent } from './navbar/navbar.component';
import { CartModalComponent } from './cart-modal/cart-modal.component';

@Component({
  selector: 'cart-app',
  standalone: true,
  imports: [CatalogComponent, CartModalComponent,  NavbarComponent],
  templateUrl: './cart-app.component.html'
})
export class CartAppComponent implements OnInit{

  products: Product[] = [];

  items: CartItem[] = [];
  
  total: number = 0;

  showCart: boolean = false;

  constructor(private service: ProductService) {}

  ngOnInit(): void {
    this.products = this.service.findAll();
    this.items = JSON.parse(sessionStorage.getItem('cart') || '[]');
    this.calculateTotal();
  }

  onAddCart(product: Product): void{

    const hasItem = this.items.find( dataItem => dataItem.product.id === product.id)

    if (hasItem) {
      this.items = this.items.map( dataItem => {
        if (dataItem.product.id === product.id) {       
          return{
            ... dataItem,
            quantity: dataItem.quantity + 1 
          }   
        }
        return dataItem;
      })
    } else {
      this.items = [... this.items, {product: {... product}, quantity: 1}];
    }
    this.saveSession();
    this.calculateTotal();
  }

  onDeleteCart(id: Number): void{
    this.items = this.items.filter(idItem => idItem.product.id !== id);
    this.saveSession();
    this.calculateTotal();
  }

  calculateTotal(): void{
    this.total = this.items.reduce((acum, item) => acum + (item.quantity*item.product.price), 0);
  }

  saveSession(): void{
    sessionStorage.setItem('cart', JSON.stringify(this.items));
  }

  openCloseCart(): void{
    this.showCart = !this.showCart;
  }

}

