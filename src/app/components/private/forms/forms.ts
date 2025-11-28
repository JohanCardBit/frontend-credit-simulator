import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../../services/auth/token/token.service';
import { UserService } from '../../../services/user/user.service';
import { FlashyService } from '../../../services/flashy/flashy.service';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './forms.html',
  styleUrl: './forms.css',
})
export class Forms {

  private userService = inject(UserService);
  private tokenService = inject(TokenService);
  private flashyService = inject(FlashyService);

  userId: string = '';
  step = 0;

  form!: FormGroup;
  employmentType: any;
  ocupacion: any;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({

      // Step 1
      gender: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      maritalStatus: ['', Validators.required],
      city: ['', Validators.required],
      academicLevel: ['', Validators.required],

      // Step 2
      workProfile: ['', Validators.required],

      contractType: [''],
      employmentYears: [''],
      incomeMonthly: [''],

      ocupacion: [''],
      profesion: [''],

      nit: [''],
      hasRUT: [''],

      // Step 3
      housingType: [''],
      ownerProperty: [''],
      otherIncomeMonthly: [''],
      expensesMonthly: [''],
      valueOfAssets: [''],
      totalDebt: [''],
      activeLoans: [''],
    });
  }

ngOnInit() {
  const tokenId = this.tokenService.getFromToken('id');

  // Normalizamos el valor a string o vacío
  const id = tokenId?.toString().trim() || '';

  // Validamos solo los casos necesarios
  if (['', 'undefined', 'null', 'no hay token valido'].includes(id)) {
    this.flashyService.error('No se encontró sesión activa. Inicia sesión nuevamente.');
    return;
  }

  // Guardamos el ID ya validado
  this.userId = id;

  // Suscripciones limpias
  this.form.get('workProfile')?.valueChanges
    .subscribe(val => this.employmentType = val);

  this.form.get('ocupacion')?.valueChanges
    .subscribe(val => this.ocupacion = val);
}


  goToStep(stepNumber: number) {
    this.step = stepNumber;
  }

  // ENVIAR FORMULARIO — CREAR / ACTUALIZAR
  submitForm() {
    if (this.form.invalid) {
      this.flashyService.error('Completa todos los campos obligatorios.');
      this.form.markAllAsTouched();
      return;
    }

    // Convertir hasRUT en boolean o null
    const raw = this.form.value;

    const payload = {
      ...raw,
      hasRUT:
        raw.hasRUT === 'true' ? true :
          raw.hasRUT === 'false' ? false :
            null
    };

    // Validaciones necesarias por tu backend
    if (payload.workProfile === 'empleado') {
      if (!payload.contractType || !payload.employmentYears || !payload.incomeMonthly) {
        this.flashyService.error(
          'Faltan datos: contrato, años trabajados o ingresos mensuales.'
        );
        return;
      }
    }

    if (payload.workProfile === 'independiente') {
      if (!payload.ocupacion || !payload.incomeMonthly) {
        this.flashyService.error(
          'Faltan datos: ocupación o ingresos mensuales.'
        );
        return;
      }

      if (payload.ocupacion === 'profesional independiente' && !payload.profesion) {
        this.flashyService.error('Debes ingresar la profesión.');
        return;
      }

      if (
        ['comerciante', 'rentista', 'transportador'].includes(payload.ocupacion) &&
        (!payload.nit || payload.hasRUT === null)
      ) {
        this.flashyService.error('Faltan datos: NIT o RUT.');
        return;
      }
    }

    // Enviar al backend
    this.userService.updateUser(this.userId, payload).subscribe({
      next: (res: any) => {
        this.flashyService.success('Información enviada correctamente.');
      },
      error: err => {
        const msg = err.error?.msj || err.error?.error || 'Error al enviar la información.';
        this.flashyService.error(msg);
        console.error(err);
      }
    });
  }

}
