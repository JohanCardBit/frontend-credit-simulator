import { Component, inject } from '@angular/core';
import { TasasService } from '../../../../services/tasas/tasas.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FlashyService } from '../../../../services/flashy/flashy.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasas',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './tasas.html',
  styleUrl: './tasas.css',
})
export class Tasas {
  tasasService = inject(TasasService)
  flashyService = inject(FlashyService);

  tasasForm!: FormGroup

  constructor(private fb: FormBuilder) {
    this.tasasForm = this.fb.group({
      type: ['fixed', Validators.required],  // fixed | variable

      // Comunes para ambos tipos
      baseRate: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      spread: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      minRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      maxRate: [100, [Validators.required, Validators.min(0), Validators.max(100)]],
      sure: [null, Validators.required],


      // Solo para variable
      volatility: [null] // Se valida dinámicamente según el tipo
    });
  }

  tasasObtenidas: any[] = [];

  ngOnInit() {
    this.getRates();
    this.validacionForm();
  }

  get isVariable() {
    return this.tasasForm.get('type')?.value === 'variable';
  }

  validacionForm() {
    this.tasasForm.get('type')?.valueChanges.subscribe(type => {
      if (type === 'variable') {
        this.tasasForm.get('volatility')?.setValidators([
          Validators.required,
          Validators.min(0),
          Validators.max(100)
        ]);
      } else {
        this.tasasForm.get('volatility')?.clearValidators();
        this.tasasForm.get('volatility')?.setValue(null);
      }

      this.tasasForm.get('volatility')?.updateValueAndValidity();
    });
  }

  getRates() {
    this.tasasService.getRates().subscribe({
      next: (res: any) => {
        this.tasasObtenidas = res
        console.log(res);
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  createRates() {

  const formValue = this.tasasForm.value;

  const body = {
    ...formValue,
    sure: formValue.sure
      ? formValue.sure / 100
      : 0
  };

  this.tasasService.createRates(body).subscribe({
    next: (res: any) => {
      this.getRates();
      this.flashyService.success('Tasa de interés creada con éxito', {
        duration: 5000
      });
      console.log(res);
    },
    error: (error: any) => {
      console.log(error);
      this.flashyService.error(`${error.error.error}`, {
        duration: 5000
      });
    }
  });
}


  private toDateInputValue(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // "2025-11-01"
  }

  idtasaInteres!: any
  verTasa(idtasa: any) {
    this.tasasService.getOneRate(idtasa).subscribe({
      next: (res: any) => {
        console.log(res);
        this.idtasaInteres = idtasa

        this.tasasForm.patchValue({
          type: res.type,
          baseRate: res.baseRate,
          spread: res.spread,
          minRate: res.minRate,
          maxRate: res.maxRate,
          volatility: res.volatility,
          sure: res.sure * 100,
          startDate: this.toDateInputValue(res.startDate),
          endDate: this.toDateInputValue(res.endDate)
        })
      },
      error: (error: any) => {
        console.log(error);
      }
    })

  }

  limpiarModal() {
    this.tasasForm.reset();
  }

  actualizarTasa() {

  const formValue = this.tasasForm.value;

  const body = {
    ...formValue,
    sure: formValue.sure
      ? formValue.sure / 100
      : 0
  };

  this.tasasService.updateRate(this.idtasaInteres, body).subscribe({
    next: (res: any) => {
      this.getRates();
      this.flashyService.success('Tasa de interés actualizada con éxito', {
        duration: 5000
      });
      console.log(res);
    },
    error: (error: any) => {
      console.log(error);
      this.flashyService.error(`${error.error.error}`, {
        duration: 5000
      });
    }
  });
}


  eliminarTasa(idtasa: any) {
    this.flashyService.confirm('¿Deseas eliminar esta tasa de interes?', {
      position: 'top-center',
      animation: 'bounce',
      onConfirm: () => {
        this.tasasService.deleteRate(idtasa).subscribe({
          next: (res: any) => {
            this.getRates()
            this.flashyService.success('Tasa de interes eliminada con exito',
              {
                duration: 5000
              })
            console.log(res);
          },
          error: (error: any) => {
            console.log(error);
          }
        })
      },
      onCancel: () => {
        this.flashyService.info('Eliminación cancelada.', {
          duration: 5000
        });
       }
    })
  }
}

