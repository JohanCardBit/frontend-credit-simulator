import { Injectable } from '@angular/core';
import { ApiUrl } from '../../environments/api-url';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SimuladorService {

  private apiUrl: string = ApiUrl.url;

  constructor(private http: HttpClient) {}


  private getTokenFromCookies(): string | null {
    const cookies = document.cookie.split(';').map(c => c.trim());
    const tokenCookie = cookies.find(c => c.startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  }

  header() {
    const token = this.getTokenFromCookies();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}`
    });
    return headers;
  }



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

  saveSimulation(simulationData: any) {
    return this.http.post(`${this.apiUrl}/simulate`, simulationData, {
      withCredentials: true // <--- Esto permite que se envíen las cookies
    });
  }

  analizarSimulacion(idSimulacion: any) {
    const headers = this.header();
    return this.http.post(`${this.apiUrl}/analizeSimulation/${idSimulacion}`,{}, { headers });
  }

  getSimulations() {
    const headers = this.header();
    return this.http.get(`${this.apiUrl}/simulations/user`, { headers });
  }

  statusPorUsuario(idSimulacion: any, body: any) {
    const headers = this.header();
    return this.http.post(`${this.apiUrl}/accept/loan/${idSimulacion}`,body, { headers });
  }
}
