import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
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
  // Servicios inyectados
  private userService = inject(UserService);
  private tokenService = inject(TokenService);
  private flashyService = inject(FlashyService);

  // ID del usuario logueado
  userId: string = '';

  // Control del paso actual del formulario por secciones
  step = 0;

  // Formulario reactivo
  form!: FormGroup;

  // Variables de control de cambios de ciertos campos
  employmentType: any;
  ocupacion: any;

  // Constructor: inicializa el formulario con sus validaciones
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      // Step 1: Información personal
      gender: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      maritalStatus: ['', Validators.required],
      city: ['', Validators.required],
      academicLevel: ['', Validators.required],

      // Step 2: Perfil laboral
      employmentType: ['', Validators.required],
      contractType: [''],
      employmentYears: [''],
      incomeMonthly: [''],
      ocupacion: [''],
      profession: [''],
      nit: [''],
      hasRUT: [''],

      // Step 3: Información financiera y de vivienda
      housingType: [''],
      ownerProperty: [''],
      otherIncomeMonthly: [''],
      expensesMonthly: [''],
      valueOfAssets: [''],
      totalDebt: [''],
      activeLoans: [''],
    });
  }

  // Inicialización del componente
  ngOnInit() {
    const tokenId = this.tokenService.getFromToken('id');
    const id = tokenId?.toString().trim() || '';

    if (['', 'undefined', 'null', 'no hay token valido'].includes(id)) {
      this.flashyService.error(
        'No se encontró sesión activa. Inicia sesión nuevamente.'
      );
      return;
    }

    this.userId = id;

    // MÉTODO QUE LIMPIA TODOS LOS CAMPOS LABORALES
    const resetEmploymentFields = () => {
      this.form.patchValue({
        contractType: '',
        employmentYears: '',
        incomeMonthly: '',
        ocupacion: '',
        profesion: '',
        nit: '',
        hasRUT: '',
      });
    };

    // MÉTODO QUE LIMPIA CAMPOS DEPENDIENTES DE OCUPACIÓN
    const resetOccupationFields = () => {
      this.form.patchValue({
        profesion: '',
        nit: '',
        hasRUT: '',
      });
    };

    // LIMPIAR CUANDO CAMBIA EL PERFIL LABORAl
    this.form.get('employmentType')?.valueChanges.subscribe((val) => {
      this.employmentType = val;

      resetEmploymentFields();
    });

    // LIMPIAR CUANDO CAMBIA LA OCUPACIÓN
    this.form.get('ocupacion')?.valueChanges.subscribe((val) => {
      this.ocupacion = val;

      resetOccupationFields();
    });
  }

  // Cambiar al paso indicado
  goToStep(stepNumber: number) {
    // Paso 0 → 1 siempre permitido
    if (this.step === 0 && stepNumber === 1) {
      this.step = 1;
      return;
    }

    // Validación Step 1
    if (stepNumber === 2) {
      if (
        !this.form.get('gender')?.valid ||
        !this.form.get('maritalStatus')?.valid ||
        !this.form.get('age')?.valid ||
        !this.form.get('city')?.valid ||
        !this.form.get('academicLevel')?.valid
      ) {
        this.flashyService.error(
          'Completa todos los campos de Información personal antes de continuar.'
        );
        return;
      }
    }

    // Validación Step 2
    if (stepNumber === 3) {
      if (!this.form.get('employmentType')?.valid) {
        this.flashyService.error(
          'Selecciona un tipo de empleo antes de continuar.'
        );
        return;
      }

      if (this.employmentType === 'empleado') {
        if (
          !this.form.get('contractType')?.valid ||
          !this.form.get('employmentYears')?.valid ||
          !this.form.get('incomeMonthly')?.valid
        ) {
          this.flashyService.error(
            'Completa todos los campos de empleado antes de continuar.'
          );
          return;
        }
      }

      if (this.employmentType === 'independiente') {
        if (
          !this.form.get('ocupacion')?.valid ||
          !this.form.get('incomeMonthly')?.valid
        ) {
          this.flashyService.error(
            'Completa todos los campos de independiente antes de continuar.'
          );
          return;
        }

        if (
          this.ocupacion === 'profesional independiente' &&
          !this.form.get('profession')?.valid
        ) {
          this.flashyService.error('Debes ingresar la profesión.');
          return;
        }

        if (
          ['comerciante', 'rentista', 'transportador'].includes(
            this.ocupacion
          ) &&
          (!this.form.get('nit')?.valid || !this.form.get('hasRUT')?.value)
        ) {
          this.flashyService.error('Completa NIT y RUT antes de continuar.');
          return;
        }
      }
    }

    // Si pasa validaciones, avanzar
    this.step = stepNumber;
  }

  // ENVIAR FORMULARIO — CREAR / ACTUALIZAR
  submitForm() {
    // Validar que todos los campos obligatorios estén completos
    if (this.form.invalid) {
      this.flashyService.error('Completa todos los campos obligatorios.');
      this.form.markAllAsTouched();
      return;
    }

    // Preparar payload a enviar al backend
    const raw = this.form.value;

    // Convertir el valor de hasRUT a booleano o null
    const payload = {
      ...raw,
      hasRUT:
        raw.hasRUT === 'true' ? true : raw.hasRUT === 'false' ? false : null,
      ocupacion:
        raw.ocupacion === '' ? null : raw.ocupacion === 'null' ? null : raw.ocupacion
    };

    // Validaciones específicas según perfil laboral
    if (payload.employmentType === 'empleado') {
      if (
        !payload.contractType ||
        !payload.employmentYears ||
        !payload.incomeMonthly
      ) {
        this.flashyService.error(
          'Faltan datos: contrato, años trabajados o ingresos mensuales.'
        );
        return;
      }
    }

    if (payload.employmentType === 'independiente') {
      if (!payload.ocupacion || !payload.incomeMonthly) {
        this.flashyService.error(
          'Faltan datos: ocupación o ingresos mensuales.'
        );
        return;
      }

      // Validación adicional para profesionales independientes
      if (
        payload.ocupacion === 'profesional independiente' &&
        !payload.profession
      ) {
        this.flashyService.error('Debes ingresar la profesión.');
        return;
      }

      // Validaciones para ocupaciones que requieren NIT y RUT
      if (
        ['comerciante', 'rentista', 'transportador'].includes(
          payload.ocupacion
        ) &&
        (!payload.nit || payload.hasRUT === null)
      ) {
        this.flashyService.error('Faltan datos: NIT o RUT.');
        return;
      }
    }

    // Enviar datos al backend
    this.userService.updateUser(this.userId, payload).subscribe({
      next: (res: any) => {
        this.flashyService.success('Información enviada correctamente.');
      },
      error: (err) => {
        const msg =
          err.error?.msj ||
          err.error?.error ||
          'Error al enviar la información.';
        this.flashyService.error(msg);
        console.error(err);
      },
    });
  }

  @Output() ejecutarFunciones = new EventEmitter;

  ejecutar() {
    this.ejecutarFunciones.emit();
  }
}
