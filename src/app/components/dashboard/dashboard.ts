import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class PasosSimulador {
  currentYear = new Date().getFullYear();

  mostrarResultados = false;

  childInstance: any = null;

  onChildEventFromChild(component: any) {
    this.childInstance = component;

    if (component.mostrarResultadosChange) {
      component.mostrarResultadosChange.subscribe((value: boolean) => {
        this.mostrarResultados = value;
      });
    }
  }

  volver() {
    if (this.childInstance && this.childInstance.volverAlFormulario) {
      this.childInstance.volverAlFormulario();
    }

    this.mostrarResultados = false;
  }
}
