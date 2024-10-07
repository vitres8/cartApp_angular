import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CatalogComponent } from './catalog/catalog.component';
import { CartItem } from '../models/cartItem';
import { NavbarComponent } from './navbar/navbar.component';
import { Router, RouterOutlet } from '@angular/router';
import { SharingDataService } from '../services/sharing-data.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'cart-app',
  standalone: true,
  imports: [CatalogComponent,  NavbarComponent, RouterOutlet],
  templateUrl: './cart-app.component.html'
})
export class CartAppComponent implements OnInit{



  items: CartItem[] = [];
  
  total: number = 0;


  constructor(
    private router: Router,
    private sharingDataService: SharingDataService,  
    private service: ProductService) {}

  ngOnInit(): void {
    this.items = JSON.parse(sessionStorage.getItem('cart') || '[]');
    this.calculateTotal();
    this.onDeleteCart();
    this.onAddCart();
  }

  onAddCart(): void{
    this.sharingDataService.productEventEmitter.subscribe( product => {

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
      this.router.navigate(['/cart'], {
        state: {items: this.items, total: this.total}
      })

      Swal.fire({
        title: "Shopping Cart",
        text: "Nuevo producto agregado",
        icon: "success"
      });

    })
  }

  onDeleteCart(): void{
    this.sharingDataService.idProductEventEmitter.subscribe( id => {
      console.log(id + 'se ha ejecutado el evento idProductEventEmitter')

      Swal.fire({
        title: "Estas Seguro que deseas Eliminar",
        text: "Cuidado",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si quiero eliminarlo"
      }).then((result) => {
        if (result.isConfirmed) {
          this.items = this.items.filter(idItem => idItem.product.id !== id);
          if(this.items.length == 0){
            sessionStorage.removeItem('cart');
            sessionStorage.clear;
          }
          this.saveSession();
          this.calculateTotal();
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>{
            this.router.navigate(['/cart'], {
              state: {items: this.items, total: this.total}
            })
          })
          Swal.fire({
            title: "Eliminado",
            text: "Su producto se ha eliminado del carrito",
            icon: "success"
          });
        }
      });
    })
  }

  calculateTotal(): void{
    this.total = this.items.reduce((acum, item) => acum + (item.quantity*item.product.price), 0);
  }

  saveSession(): void{
    sessionStorage.setItem('cart', JSON.stringify(this.items));
  }

}

