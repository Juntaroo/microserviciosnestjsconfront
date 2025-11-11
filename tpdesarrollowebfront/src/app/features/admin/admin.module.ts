import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user-list/user-list';
import { UserRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    UserComponent
  ]
})
export class AdminModule { }