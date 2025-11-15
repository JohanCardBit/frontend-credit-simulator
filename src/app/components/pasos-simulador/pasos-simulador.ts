import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pasos-simulador',
  imports: [RouterOutlet],
  templateUrl: './pasos-simulador.html',
  styleUrl: './pasos-simulador.css',
})
export class PasosSimulador {
  currentYear = new Date().getFullYear();

}
