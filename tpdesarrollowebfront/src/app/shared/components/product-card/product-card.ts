import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Productito } from '../../../core/interfaces/product.interface';
import { CartService } from '../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-card',
  standalone: true,
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Productito;
  @Output() productChanged = new EventEmitter<void>();

  constructor(
    private cartService: CartService,
    private toastr: ToastrService
  ) {}

  addToCart() {
    this.cartService.createCart({ idProduct: this.product.id!, quantity: 1 }).subscribe({
      next: () => {
        this.toastr.success('Producto agregado al carrito');
        this.productChanged.emit();
      },
      error: () => this.toastr.error('No se pudo agregar el producto')
    });
  }
}
