import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  carts: any[] = [];
  totalPrice = 0;

  constructor(
    private cartService: CartService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCarts();
  }

  loadCarts(): void {
    this.cartService.getCartByUserToken().subscribe({
      next: (res) => {
        this.carts = res || [];
        this.calculateTotal();
      },
      error: () => this.toastr.error('Error al obtener los carritos'),
    });
  }

  calculateTotal(): void {
    this.totalPrice = this.carts.reduce((acc, cart) => acc + (cart.totalPrice || 0), 0);
  }
}
