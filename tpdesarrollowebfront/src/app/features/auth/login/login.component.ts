import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,         
    ReactiveFormsModule    
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  // Inyectamos lo que necesitamos
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public loginForm: FormGroup;
  public errorMessage: string | null = null; // Para mostrar errores

  constructor() {
     console.log('LoginComponent cargado ✅');
    // Creamos el formulario reactivo
    this.loginForm = this.fb.group({
      // Asumo que tu backend espera 'email' y 'password'
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Muestra errores si el form es inválido
      return;
    }

    this.errorMessage = null; // Limpia errores previos
    const credentials = this.loginForm.value;

    // ¡Aquí llamamos al servicio!
    this.authService.login(credentials).subscribe({
      next: (response) => {
        // ¡Éxito! El servicio ya guardó el token.
        // Navegamos al dashboard principal.
        this.router.navigate(['/dashboard']); 
      },
      error: (err) => {
        // Error en el login
        console.error('Error de login:', err);
        this.errorMessage = 'Credenciales incorrectas. Por favor, intente de nuevo.';
        //[cite_start]// Aquí podrías usar SweetAlert2 como pide el PDF [cite: 28]
      }
    });
  }
  goToRegister() {
    
    this.router.navigate(['/auth/register']);
  }
}
