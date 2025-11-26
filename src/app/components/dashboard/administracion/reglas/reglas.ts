import { Component, inject } from '@angular/core';
import { ReglasService } from '../../../../services/reglas/reglas.service';
import { Form, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FlashyService } from '../../../../services/flashy/flashy.service';

@Component({
  selector: 'app-reglas',
  imports: [ReactiveFormsModule],
  templateUrl: './reglas.html',
  styleUrl: './reglas.css',
})
export class Reglas {
  reglasService = inject(ReglasService)
  flashyService = inject(FlashyService)

  reglas: any[] = []
  drop = true
  rulesForm!: FormGroup

  ruleFields = [
    { key: 'creditScore', label: 'Score Crediticio', type: 'number' },
    { key: 'incomeMonthly', label: 'Ingresos Mensuales', type: 'number' },
    { key: 'activeLoans', label: 'Créditos Activos', type: 'number' },
    { key: 'employmentYears', label: 'Años de Empleo', type: 'number' },
    { key: 'contractType', label: 'Tipo de Contrato', type: 'string' },
    { key: 'employmentType', label: 'Tipo de Empleo', type: 'string' },
    { key: 'profession', label: 'Profesión', type: 'string' },
    { key: 'expensesMonthly', label: 'Gastos Mensuales', type: 'number' },
    { key: 'age', label: 'Edad', type: 'number' },
    { key: 'maritalStatus', label: 'Estado Civil', type: 'string' },
    { key: 'housingType', label: 'Tipo de Vivienda', type: 'string' },
    { key: 'amount', label: 'Monto Solicitado', type: 'number' },
    { key: 'termMonths', label: 'Plazo en Meses', type: 'number' },
    { key: 'monthlyPayment', label: 'Cuota Mensual', type: 'number' },
    { key: 'profile', label: 'Perfil', type: 'string' },
  ];

  constructor(private fb: FormBuilder) {
    this.rulesForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      riskCategory: ['', Validators.required],
      interestRateAdjustment: ['', Validators.required],
      conditions: this.fb.array([], Validators.required)
    });
  }


  ngOnInit() {
    this.getReglas()
  }


  get conditions() {
    return this.rulesForm.get('conditions') as FormArray;
  }

  addCondition() {
    this.conditions.push(this.fb.group({
      field: ['', Validators.required],
      operator: ['', Validators.required],
      value: ['', Validators.required],
      logic: [''] // valor por defecto
    }));
  }

  removeCondition(index: number) {
    this.conditions.removeAt(index);
  }





  getReglas() {
    this.reglasService.getBusinessRules().subscribe({
      next: (data: any) => {
        console.log(data.data)
        this.reglas = data.data
      },
      error: (error: any) => {
        console.log(error)
      }
    })
  }

  crearRegla() {

    const payload = {
      name: this.rulesForm.value.name,
      type: this.rulesForm.value.type,
      condition: this.conditions.value,
      description: this.rulesForm.value.description,
      riskCategory: this.rulesForm.value.riskCategory,
      interestRateAdjustment: this.rulesForm.value.interestRateAdjustment
    };

    this.flashyService.confirm('¿Estas seguro de crear esta regla?', {
      position: 'top-center',
      animation: 'bounce',
      onConfirm: () => {
        this.reglasService.createBusinessRule(payload).subscribe({
          next: (data: any) => {
            this.getReglas();
            this.flashyService.success('Regla creada con éxito', { duration: 5000 });
          },
          error: (error: any) => {
            console.log(error)
            this.flashyService.error(`${error.error.msj}`, { duration: 5000 });
          }
        });
      },
      onCancel: () => {
        this.flashyService.info('Creación cancelada.', { duration: 5000 });
      }
    });
  }

  getFieldLabel(key: string) {
    const field = this.ruleFields.find(f => f.key === key);
    return field ? field.label : key;
  }

  verRegla(idRegla: any) {
    this.conditions.clear();
    this.reglasService.getOneBusinessRule(idRegla).subscribe({
      next: (data: any) => {
        for (let i = 0; i < data.condition.length; i++) {
          this.addCondition()
        }
        this.rulesForm.patchValue(data)
        this.rulesForm.get('conditions')?.patchValue(data.condition)
        console.log(data)

      },
      error: (error: any) => {
        console.log(error)
      }
    })
  }

  get activeRulesCount(): number {
    if (this.drop == true) {
      return this.reglas ? this.reglas.filter(r => r.isActive).length : 0;
    } else {
      return this.reglas ? this.reglas.filter(r => !r.isActive).length : 0;
    }
  }

  limpiarForm() {
    this.rulesForm.reset();
    this.conditions.clear();
  }

  eliminarRegla(idRegla: any) {
    this.flashyService.confirm('¿Estas seguro de eliminar esta regla?', {
      position: 'top-center',
      animation: 'bounce',
      onConfirm: () => {
        this.reglasService.deleteBusinessRule(idRegla).subscribe({
          next: (data: any) => {
            this.getReglas();
            console.log(data);

            this.flashyService.success(`${data.msj}`, { duration: 5000 });
          },
          error: (error: any) => {
            console.log(error)
            this.flashyService.error(`${error.error.msj}`, { duration: 5000 });
          }
        });
      },
      onCancel: () => {
        this.flashyService.info('Eliminación cancelada.', { duration: 5000 });
      }
    });
  }

  recuperarRegla(idRegla: any) {
    this.flashyService.confirm('¿Estas seguro de recuperar esta regla?', {
      position: 'top-center',
      animation: 'bounce',
      onConfirm: () => {
        this.reglasService.updateBusinessRule(idRegla, { isActive: true }).subscribe({
          next: (data: any) => {
            this.getReglas();
            console.log(data);

            this.flashyService.success(`${data.msj}`, { duration: 5000 });
          },
          error: (error: any) => {
            console.log(error)
            this.flashyService.error(`${error.error.msj}`, { duration: 5000 });
          }
        });
      },
      onCancel: () => {
        this.flashyService.info('Recuperación cancelada.', { duration: 5000 });
      }
    });
  }

}
