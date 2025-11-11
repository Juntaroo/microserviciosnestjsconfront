import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

/**
 * Validador personalizado para asegurar que la contraseña y su confirmación coincidan.
 */
export const passwordMatcher: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  // Si los controles no existen o aún no se han tocado, no hay error
  if (!password || !confirmPassword) {
    return null;
  }
  
  // Si los campos están vacíos pero son válidos (ej. al inicio), no hay error
  if (password.value === '' || confirmPassword.value === '') {
    return null;
  }

  // Devuelve error si no coinciden
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
};


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  // ----- MODIFICACIÓN AQUÍ -----
  // Apuntamos a los archivos externos en lugar de usar 'template'
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  // -----------------------------
  // Usamos OnPush para mejor rendimiento
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {

  // Inyectamos lo que necesitamos
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public registerForm: FormGroup;
  public errorMessage: string | null = null;

  constructor() {
    console.log('RegisterComponent cargado ✅');
    // Creamos el formulario reactivo
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      // Añadimos el validador a nivel de grupo
      validators: [passwordMatcher]
    });
  }

  /**
   * Intenta registrar al usuario.
   */
  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched(); // Muestra errores si el form es inválido
      return;
    }

    this.errorMessage = null;
    
    // No enviamos 'confirmPassword' al backend
    const { name, email, password } = this.registerForm.value;
    const credentials = { name, email, password };

    // ¡Aquí llamamos al servicio! (Deberás crear este método en AuthService)
    this.authService.register(credentials).subscribe({
      next: (response) => {
        // ¡Éxito!
        console.log('Registro exitoso:', response);
        // Opcional: podrías mostrar un mensaje de éxito y redirigir
        // this.router.navigate(['/auth/login'], { queryParams: { registered: 'true' } });
        
        // O si el registro también hace login:
         this.router.navigate(['/dashboard']); 
      },
      error: (err) => {
        // Error en el registro
        console.error('Error de registro:', err);
        // Asumimos que el backend devuelve un mensaje de error claro
        this.errorMessage = err.error?.message || 'Error en el registro. Es posible que el email ya esté en uso.';
      }
    });
  }
  
  /**
   * Navega a la página de login.
   */
  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}