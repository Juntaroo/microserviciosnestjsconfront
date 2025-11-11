import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Asegúrate que la ruta al servicio sea correcta

export const authGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  // Asumo que tu AuthService tiene un método para verificar si hay un JWT 
  // Por ejemplo, `isAuthenticated()` que revisa localStorage o una variable.
  if (authService.isAuthenticated()) {
    return true; // Si está autenticado, déjalo pasar
  }

  // Si no está autenticado, redirige al login
  router.navigate(['/auth/login']); // O la ruta que tengas para tu login
  return false; 
};

/*
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (this.auth.getToken()) return true;
    return this.router.createUrlTree(['/auth/login']);
  }
}
*/