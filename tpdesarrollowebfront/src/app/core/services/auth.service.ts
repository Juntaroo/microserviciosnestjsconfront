import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);
  
  // Ya no necesitas 'backendUrl' aquí, todo viene del 'environment'

  login(credentials: any): Observable<any> {
    // Usa la URL del environment
    return this.http.post(environment.api.auth.login, credentials).pipe(
      tap((response: any) => {
        if (response && response.access_token) {
          this.saveTokenAndRole(response.access_token);
        }
      })
    );
  }
  
  register(credentials: any): Observable<any> {
    // Usa la URL del environment
    return this.http.post(environment.api.auth.register, credentials).pipe(
      tap((response: any) => {
        // Asumimos que el backend devuelve un token al registrarse
        // (igual que en el login)
        if (response && response.access_token) {
          this.saveTokenAndRole(response.access_token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role'); // ¡Importante! Borrar también el rol
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
}

 
  isAdmin(): boolean {
    const role = localStorage.getItem('user_role');
    
    return role === 'ADMIN'; 
  }
getProfile(): Observable<any> {
  const token = this.getToken();

  if (!token) {
    throw new Error('No hay token disponible. El usuario no está autenticado.');
  }

  // Llamamos al endpoint del perfil usando la URL definida en environment
  return this.http.get(environment.api.auth.perfil);
}

  
  private saveTokenAndRole(token: string): void {
    localStorage.setItem('token', token);
    
    try {
     
      const payload = JSON.parse(atob(token.split('.')[1]));
      
 
      const userRole = payload.role || payload.roles?.[0];
      
      if (userRole) {
          
        localStorage.setItem('user_role', userRole);
      }
    } catch (e) {
      console.error('Error decodificando el JWT', e);
      
    }
  }
}
