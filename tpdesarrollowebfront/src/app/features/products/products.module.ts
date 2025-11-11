import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductComponent } from './product-list/product.component';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ProductComponent
  ]
})
export class ProductsModule { }