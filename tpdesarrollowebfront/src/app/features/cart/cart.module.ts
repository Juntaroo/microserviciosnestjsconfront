import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartViewComponent } from './cart-view/cart.component';
import { CartRoutingModule } from './cart-routing.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    CartRoutingModule,
    CartViewComponent
  ]
})
export class CartModule { }