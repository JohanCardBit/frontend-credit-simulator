import { Injectable } from '@angular/core';
import { ApiUrl } from '../../environments/api-url';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SimuladorService {

  private apiUrl: string = ApiUrl.url;

  constructor(private http: HttpClient) {}

  // Simula los tres escenarios de préstamo en paralelo
  simular(amount: number, termMonths: number) {
    const baseStart = new Date().toISOString().split('T')[0];

    const simulacionFija = this.http.post(
      `${this.apiUrl}/simulate`,
      {
        amount,
        termMonths,
        amortizationType: 'annuity',
        rateType: 'fixed',
        startDate: baseStart,
      }
    );

    const simulacionVariableFija = this.http.post(
      `${this.apiUrl}/simulate`,
      {
        amount,
        termMonths,
        amortizationType: 'annuity',
        rateType: 'variable',
        startDate: baseStart,
      }
    );

    const simulacionVariableVariable = this.http.post(
      `${this.apiUrl}/simulate`,
      {
        amount,
        termMonths,
        amortizationType: 'linear',
        rateType: 'variable',
        startDate: baseStart,
      }
    );

    // Ejecuta las 3 solicitudes en paralelo y devuelve un solo observable
    return forkJoin({
      fija: simulacionFija,
      variableFija: simulacionVariableFija,
      fullVariable: simulacionVariableVariable,
    });
  }
}
