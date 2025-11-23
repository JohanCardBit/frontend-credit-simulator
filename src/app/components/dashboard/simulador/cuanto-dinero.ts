import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SimuladorService } from '../../../services/simulador/simulador.service';
import { DecimalPipe } from '@angular/common';
import { FlashyService } from '../../../services/flashy/flashy.service';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-cuanto-dinero',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe, RouterLink],
  templateUrl: './cuanto-dinero.html',
  styleUrl: './cuanto-dinero.css',
})
export class CuantoDinero {

  // Variables del formulario
  form: FormGroup;


  // Resultados de la simulación
  resultados: any = null;


  // Control de vistas
  mostrarResultados = false;
  mostrarWelcome = false;
  mostrarPlanPagos = false;
  tipoPlanSeleccionado: 'fija' | 'variableFija' | 'fullVariable' | null = null;


  // Plan de pagos activo
  planActivo: any = null;
  anios: number[] = [];
  schedulePorAnios: any[][] = [];
  anioSeleccionado = 0;


  // Servicios inyectados
  private flashyService = inject(FlashyService);
  private simuladorService = inject(SimuladorService)


  // Constructor inyecta FormBuilder y configura el formulario
  constructor(private fb: FormBuilder) {

    // Inicialización del formulario
    this.form = this.fb.group({
      amount: [null, [Validators.required, Validators.min(1_000_000), Validators.max(500_000_000)]],
      termMonths: [48, [Validators.required, Validators.min(48), Validators.max(84)]],
      birthDate: ['', [Validators.required]],
    });
  }


  // Calcular la edad a partir de una fecha
  private calcularEdad(fecha: string): number {
    const birth = new Date(fecha);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();

    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

    return age;
  }


  // Ejecutar la simulación de crédito
  simular() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.flashyService.warning('Por favor completa todos los campos correctamente.');
      return;
    }

    const { amount, termMonths, birthDate } = this.form.value;

    // Validar que el usuario sea mayor de 18 años
    if (this.calcularEdad(birthDate) < 18) {
      this.form.get('birthDate')?.setErrors({ underAge: true });
      this.flashyService.error('Debes ser mayor de 18 años para continuar.');
      return;
    }

    // Confirmación antes de simular
    this.flashyService.confirm('¿Deseas realizar la simulación?', {
      position: 'top-center',
      animation: 'bounce',
      onConfirm: () => {
        this.simuladorService.simular(amount, termMonths).subscribe({
          next: (data) => {
            this.resultados = data;
            this.mostrarResultados = true;
            this.flashyService.success('Simulación realizada con éxito.');
            console.log('3 simulaciones:', data);
          },
          error: (err) => {
            console.error('Error al realizar la simulación:', err);
            this.flashyService.error('Ocurrió un error al realizar la simulación.');
          }
        });
      },
      onCancel: () => {
        this.flashyService.info('Simulación cancelada.');
      }
    });
  }


  // Obtener la primera tasa mensual a partir de la anual
  getPrimerRate(rate: any): number {
    if (Array.isArray(rate)) {
      return rate[0] / 12;
    }
    return (rate ?? 0) / 12;
  }


  // Mostrar el plan de pagos completo
  verPlanPagos(tipo: 'fija' | 'variableFija' | 'fullVariable') {
    this.planActivo = this.resultados[tipo].schedule;

    // Calcular cuántos años hay
    const totalPeriodos = this.planActivo.length;
    const totalAnios = Math.ceil(totalPeriodos / 12);
    this.anios = Array.from({ length: totalAnios }, (_, i) => i + 1);

    // Dividir el schedule en bloques de 12 meses
    this.schedulePorAnios = [];
    for (let i = 0; i < totalAnios; i++) {
      const inicio = i * 12;
      const fin = inicio + 12;
      this.schedulePorAnios.push(this.planActivo.slice(inicio, fin));
    }

    // Seleccionar el primer año por defecto
    this.anioSeleccionado = 0;

    // Mostrar plan de pagos y ocultar otras secciones
    this.mostrarPlanPagos = true;
    this.mostrarResultados = false;
    this.mostrarWelcome = false;
  }



  // Volver al simulador desde tarjetas de crédito
  volverAlSimulador() {
    this.mostrarResultados = false;
    this.mostrarWelcome = false;
  }

  // Volver a opciones de tarjetas de crédito desde Welcome
  volverAOpciones() {
    this.mostrarWelcome = false;
    this.mostrarResultados = true;
  }

  // Volver a opciones de tarjetas de crédito desde plan de pagos
  volverAOpcionesDesdePlan() {
    this.mostrarPlanPagos = false;
    this.mostrarResultados = true;
    this.tipoPlanSeleccionado = null;
  }

}
