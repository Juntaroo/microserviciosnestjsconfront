import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  products: any[] = [];
  carts: any[] = [];
  totalPrice = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCarts();
  }

  loadProducts() {
    this.productService.allProducts().subscribe({
      next: (res) => (this.products = res.data || res),
      error: () => this.toastr.error('No se pudieron cargar los productos')
    });
  }

  loadCarts() {
    this.cartService.getCartByUserToken().subscribe({
      next: (res) => {
        this.carts = res;
        this.totalPrice = res.reduce((sum: number, c: any) => sum + (c.totalPrice || 0), 0);
      },
      error: () => this.toastr.error('Error al obtener carritos')
    });
  }
}
