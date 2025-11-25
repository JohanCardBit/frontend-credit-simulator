import { ChartConfiguration, ChartType } from 'chart.js';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SimuladorService } from '../../../../services/simulador/simulador.service';
import { DecimalPipe } from '@angular/common';
import { FlashyService } from '../../../../services/flashy/flashy.service';
import { RouterLink } from "@angular/router";
import { BaseChartDirective, } from 'ng2-charts';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend, Filler } from 'chart.js';
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend, Filler);


@Component({
  selector: 'app-cuanto-dinero',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe, RouterLink, BaseChartDirective],
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

    const totalPeriodos = this.planActivo.length;
    const totalAnios = Math.ceil(totalPeriodos / 12);
    this.anios = Array.from({ length: totalAnios }, (_, i) => i + 1);

    this.schedulePorAnios = [];
    for (let i = 0; i < totalAnios; i++) {
      const inicio = i * 12;
      const fin = inicio + 12;
      this.schedulePorAnios.push(this.planActivo.slice(inicio, fin));
    }

    this.anioSeleccionado = 0;

    // Preparar datos del gráfico
    this.chartData.labels = this.planActivo.map((m: any) => `Mes ${m.period}`);
    this.chartData.datasets = [
      {
        label: 'Saldo pendiente',
        data: this.planActivo.map((m: any) => m.balance),
        borderColor: 'blue',
        backgroundColor: 'rgba(0,0,255,0.3)',
        fill: true
      },
      {
        label: 'Cuota mensual',
        data: this.planActivo.map((m: any) => m.payment),
        borderColor: 'green',
        backgroundColor: 'rgba(0,255,0,0.3)',
        fill: true
      }
    ];

    this.mostrarPlanPagos = true;
    this.mostrarResultados = false;
    this.mostrarWelcome = false;

  }


  // Volver al simulador desde  opciones de  crédito
  volverAlSimulador() {
    this.mostrarResultados = false;
    this.mostrarWelcome = false;
  }

  // Volver a opciones de  crédito desde Welcome
  volverAOpciones() {
    this.mostrarWelcome = false;
    this.mostrarResultados = true;
  }

  // Volver a opciones de crédito desde plan de pagos
  volverAOpcionesDesdePlan() {
    this.mostrarPlanPagos = false;
    this.mostrarResultados = true;
    this.tipoPlanSeleccionado = null;
  }








  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  // Datos del gráfico
  chartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Saldo pendiente',
        data: [],
        borderColor: 'rgba(0, 123, 255, 1)',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: true
      },
      {
        label: 'Cuota mensual',
        data: [],
        borderColor: 'rgba(40, 167, 69, 1)',
        backgroundColor: 'rgba(40, 167, 69, 0.2)',
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Opciones del gráfico
  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { font: { size: 14, weight: 'bold' } }
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context) {
            const value = context.parsed.y ?? 0;
            return `${context.dataset.label}: $${value.toLocaleString()}`;
          }
        }
      },
      title: {
        display: true,
        font: { size: 18, weight: 'bold' }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Meses', font: { size: 14, weight: 'bold' } },
        grid: { color: 'rgba(0,0,0,0.05)' }
      },
      y: {
        title: { display: true, text: 'Monto ($)', font: { size: 14, weight: 'bold' } },
        ticks: {
          callback: (value: any) => `$${value.toLocaleString()}`
        },
        grid: { color: 'rgba(0,0,0,0.05)' }
      }
    }
  };


  // Tipo de gráfico
  chartType: ChartType = 'line';


  mostrarGrafico(tipo: 'fija' | 'variableFija' | 'fullVariable') {
    if (!this.resultados || !this.resultados[tipo]) return;

    const schedule = this.resultados[tipo].schedule;

    // Labels: Mes 1, Mes 2, …
    this.chartData.labels = schedule.map((s: any, index: number) => `Mes ${index + 1}`);

    // Dataset: saldo pendiente por mes
    this.chartData.datasets = [
      {
        label: `Saldo pendiente - ${tipo}`,
        data: schedule.map((s: any) => s.balance),
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.3)',
        fill: true,
        tension: 0.4
      }
    ];
  }


}
