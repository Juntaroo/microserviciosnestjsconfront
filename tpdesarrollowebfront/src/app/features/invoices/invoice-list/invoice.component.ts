import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../../core/services/invoice.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoice.component.html',
  standalone: false,
  styleUrls: ['./invoice.component.scss']
})
export class InvoicesComponent implements OnInit {
  invoices: any[] = [];

  constructor(
    private invoiceService: InvoiceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.invoiceService.getAll().subscribe({
      next: (res) => (this.invoices = res.data || res),
      error: () => this.toastr.error('Error al cargar las facturas')
    });
  }
}
