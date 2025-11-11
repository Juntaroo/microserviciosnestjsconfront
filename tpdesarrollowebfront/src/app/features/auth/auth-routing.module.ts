import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
// --- 1. Importamos el nuevo guard ---
import { noAuthGuard } from '../../core/guards/noauthguard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    // --- 2. Aplicamos el guard ---
    canActivate: [noAuthGuard]
  },
  {
    path: 'register', 
    component: RegisterComponent,
    // --- 3. Aplicamos el guard ---
    canActivate: [noAuthGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}