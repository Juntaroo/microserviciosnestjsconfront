import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(environment.api.invoices.all);
  }

  getById(id: string | number): Observable<any> {
    return this.http.get(environment.api.invoices.byId(id));
  }

  create(invoice: any): Observable<any> {
    return this.http.post(environment.api.invoices.create, invoice);
  }
}
