import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesComponent } from './invoice-list/invoice.component';
import { InvoiceRoutingModule } from './invoice-routing.module';

@NgModule({
  declarations: [InvoicesComponent],
  imports: [CommonModule, InvoiceRoutingModule],
})
export class InvoiceModule {}
