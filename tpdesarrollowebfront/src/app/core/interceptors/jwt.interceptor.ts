// src/app/core/interceptors/jwt.interceptor.ts
import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Ajusta la ruta al servicio

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  private authService = inject(AuthService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // 1. Obtiene el token del servicio
    const token = this.authService.getToken();

    // 2. Si el token existe, clona la petición y añade el header 'Authorization'
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // Formato estándar de JWT
        }
      });
    }

    // 3. Deja que la petición continúe (con o sin el token)
    return next.handle(request);
  }
}
/*
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}*/
