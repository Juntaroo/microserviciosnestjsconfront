import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Carrito } from '../interfaces/cart.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private http: HttpClient) {}

  /** Obtener todos los carritos */
  allCarts(): Observable<any> {
    return this.http.get(environment.api.carts.all);
  }

  /** Obtener carrito por ID */
  getCartById(cartId: string | number): Observable<any> {
    return this.http.get(environment.api.carts.byId(cartId));
  }

  /** Obtener carritos de un usuario específico */
  getCartByUserId(userId: string | number): Observable<any> {
    return this.http.get(environment.api.carts.byUserId(userId));
  }

  /** Obtener carritos usando el token del usuario logueado */
  getCartByUserToken(): Observable<any> {
    return this.http.get(environment.api.carts.byUserToken);
  }

  /** Crear un nuevo carrito */
  createCart(cart: Carrito): Observable<any> {
    return this.http.post(environment.api.carts.create, cart);
  }

  /** Actualizar un carrito existente */
  updateCart(cart: Carrito): Observable<any> {
    const { id, ...cartData } = cart;
    return this.http.put(environment.api.carts.update(id ?? ''), cartData);
  }

  /** Eliminar carrito por ID */
  deleteCart(cartId: string | number): Observable<any> {
    return this.http.delete(environment.api.carts.delete(cartId));
  }
}
