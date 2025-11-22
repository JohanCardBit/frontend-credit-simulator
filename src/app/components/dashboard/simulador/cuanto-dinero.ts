import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SimuladorService } from '../../../services/simulador/simulador.service';
import { DecimalPipe } from '@angular/common';
import { FlashyService } from '../../../services/flashy/flashy.service';


@Component({
  selector: 'app-cuanto-dinero',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './cuanto-dinero.html',
  styleUrl: './cuanto-dinero.css',
})
export class CuantoDinero {

  @Output() mostrarResultadosChange = new EventEmitter();

  form: FormGroup;
  resultados: any = null;
  mostrarResultados = false;

  private flashyService = inject(FlashyService);

  constructor(private fb: FormBuilder, private simuladorService: SimuladorService) {
    this.form = this.fb.group({
      amount: [null, [Validators.required, Validators.min(1_000_000), Validators.max(500_000_000)]],
      termMonths: [48, [Validators.required, Validators.min(48), Validators.max(84)]],
      birthDate: ['', [Validators.required]],
    });
  }

  private calcularEdad(fecha: string): number {
    const birth = new Date(fecha);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();

    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

    return age;
  }

  simular() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.flashyService.warning('Por favor completa todos los campos correctamente.');
      return;
    }

    const { amount, termMonths, birthDate } = this.form.value;

    // VALIDAR MAYOR DE EDAD
    if (this.calcularEdad(birthDate) < 18) {
      this.form.get('birthDate')?.setErrors({ underAge: true });
      this.flashyService.error('Debes ser mayor de 18 años para continuar.');
      return;
    }

    // LLAMADAS A LAS 3 SIMULACIONES
    this.simuladorService.simular(amount, termMonths).subscribe({
      next: (data) => {

        this.resultados = data;
        this.mostrarResultados = true;
        this.mostrarResultadosChange.emit(true);
        this.flashyService.success('Simulación realizada con éxito.');
        console.log('3 simulaciones:', data);
      },
      error: (err) => {

        console.error('Error al realizar la simulación:', err);
        this.flashyService.error('Ocurrió un error al realizar la simulación.');
      }
    });
  }

  getPrimerRate(rate: any): number {
    if (Array.isArray(rate)) {
      return rate[0] / 12;
    }
    return (rate ?? 0) / 12;
  }

  volverAlFormulario() {
    this.mostrarResultados = false;
    this.mostrarResultadosChange.emit(false);
  }

}
