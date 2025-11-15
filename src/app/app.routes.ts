import { Routes } from '@angular/router';
import { CuantoDinero } from './components/pasos-simulador/cuanto-dinero/cuanto-dinero';
import { PasosSimulador } from './components/pasos-simulador/pasos-simulador';


const titulosRutas = {
  simulador: 'CrediTest | Simula tu credito',
  cuantoDineroNecesitas: 'CrediTest | ¿Cuánto dinero necesitas?'
}

const rutasPubilcas: Routes = [
  { path: '', redirectTo: 'Simulador/Cuanto-Necesitas', pathMatch: 'full' },

  { path: 'Simulador', component: PasosSimulador, title: titulosRutas.simulador, children: [
      { path: 'Cuanto-Necesitas', component: CuantoDinero, title: titulosRutas.cuantoDineroNecesitas }

    ]
  },

]


const rutasPrivadas: Routes = []



export const routes: Routes = [
  ...rutasPubilcas,
  ...rutasPrivadas,
];
