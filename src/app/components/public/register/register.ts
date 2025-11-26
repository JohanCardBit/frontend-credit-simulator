import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { FlashyService } from '../../../services/flashy/flashy.service';
import { RegisterService } from '../../../services/auth/register/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  // control de vistas
  mostrarInformacion = true;
  mostrarGroup = false;
  mostrarDocumento = false;
  mostrarCrearCuenta = false;

  // formulario
  registerForm: FormGroup;

  private flashyService = inject(FlashyService);
  private registerService = inject(RegisterService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZáéíóúüÁÉÍÓÚÜ\s]+$/)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZáéíóúüÁÉÍÓÚÜ\s]+$/)]],
      documentType: ['cc', Validators.required],
      documentNumber: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20), Validators.pattern(/^[0-9]+$/)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(7), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', Validators.required],
    });
  }


  //  Control de pasos
  continuar() {
    // PASO 1
    if (this.mostrarInformacion) {
      this.mostrarInformacion = false;
      this.mostrarGroup = true;
      return;
    }

    // PASO 2
    if (this.mostrarGroup) {
      if (!this.isValidStep(['name', 'lastName'])) {
        this.flashyService.warning('Por favor completa tu nombre y apellido correctamente.');
        return;
      }

      this.mostrarGroup = false;
      this.mostrarDocumento = true;
      return;
    }

    // PASO 3
    if (this.mostrarDocumento) {
      if (!this.isValidStep(['documentType', 'documentNumber'])) {
        this.flashyService.warning('Ingresa un documento válido.');
        return;
      }

      this.mostrarDocumento = false;
      this.mostrarCrearCuenta = true;
      return;
    }

    // PASO 4
    if (this.mostrarCrearCuenta) {
      const pass = this.registerForm.get('password')!.value;
      const conf = this.registerForm.get('confirmPassword')!.value;

      if (!this.isValidStep(['email', 'password', 'confirmPassword'])) {
        this.flashyService.error('Por favor completa correctamente tu correo y contraseña.');
        return;
      }

      if (pass !== conf) {
        this.flashyService.error('Las contraseñas no coinciden.');
        return;
      }
    }
  }

  atras() {
    if (this.mostrarCrearCuenta) {
      this.mostrarCrearCuenta = false;
      this.mostrarDocumento = true;
      return;
    }
    if (this.mostrarDocumento) {
      this.mostrarDocumento = false;
      this.mostrarGroup = true;
      return;
    }
    if (this.mostrarGroup) {
      this.mostrarGroup = false;
      this.mostrarInformacion = true;
      return;
    }
  }

  //  Helpers
  private isValidStep(campos: string[]): boolean {
    let ok = true;
    campos.forEach((campo) => {
      const control = this.registerForm.get(campo);
      control?.markAsTouched();
      control?.updateValueAndValidity();
      if (control?.invalid) ok = false;
    });
    return ok;
  }


  //  Método para registrar usuario
  registrarse() {
    const data = {
      name: this.registerForm.value.name,
      lastName: this.registerForm.value.lastName,
      documentType: this.registerForm.value.documentType,
      documentNumber: this.registerForm.value.documentNumber,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
    };

    this.registerService.postRegister(data).subscribe({
      next: () => {
        this.flashyService.success('Cuenta creada exitosamente.');

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 900);
      },

      error: (err: any) => {
        const msg = err.error?.error || err.error?.msj || 'Error al crear usuario';
        this.flashyService.error(msg);
      },
    });
  }
}
