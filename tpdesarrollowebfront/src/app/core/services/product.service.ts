import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const API = 'http://localhost:3000';

export class ProductService {
  constructor(private http: HttpClient) {}

  // Obtener todos los productos
  allProducts(): Observable<any> {
    return this.http.get(environment.api.products.all);
  }

  // Obtener producto por ID
  getProductById(id: string | number): Observable<any> {
    return this.http.get(environment.api.products.byId(id));
  }

  // Crear producto
  createProduct(product: any): Observable<any> {
    return this.http.post(environment.api.products.create, product);
  }

  // Actualizar producto
  updateProduct(id: string | number, product: any): Observable<any> {
    return this.http.put(environment.api.products.update(id), product);
  }

  // Eliminar producto
  deleteProduct(id: string | number): Observable<any> {
    return this.http.delete(environment.api.products.delete(id));
  }
  
}
