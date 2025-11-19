import { Routes } from '@angular/router';
import { CuantoDinero } from './components/dashboard/simulador/cuanto-dinero';
import { PasosSimulador } from './components/dashboard/dashboard';
import { Login } from './components/public/login/login';
import { Administracion } from './components/dashboard/administracion/administracion';
import { Perfil } from './components/dashboard/administracion/perfil/perfil';
import { Tasas } from './components/dashboard/administracion/tasas/tasas';


const titulosRutas = {
  login: 'CrediTest | Login',
  simulador: 'CrediTest | Simula tu credito',
  cuantoDineroNecesitas: 'CrediTest | ¿Cuánto dinero necesitas?',
  administacion: 'CrediTest | Administración',
  PerfilAdmin: 'CrediTest | Perfil Administracion',
  tasas: 'CrediTest | Tasas de interés'
}

const rutasPubilcas: Routes = [
  { path: '', redirectTo: 'dashboard/simulador', pathMatch: 'full' },


  { path: 'login', component: Login, title: titulosRutas.login },
  {
    path: 'dashboard', component: PasosSimulador, title: titulosRutas.simulador, children: [
      { path: 'simulador', component: CuantoDinero, title: titulosRutas.cuantoDineroNecesitas },
      {
        path: 'admin', component: Administracion, title: titulosRutas.administacion, children: [
          { path: 'perfil', component: Perfil, title: titulosRutas.PerfilAdmin },
          { path: 'tasas', component: Tasas, title: titulosRutas.tasas }
        ]
      }
    ]
  },

]


const rutasPrivadas: Routes = [
  // { path: 'Simulador', component: PasosSimulador, title: titulosRutas.simulador, children: [
  //     { path: 'admin', component: Administracion, title: titulosRutas.administacion}
  //   ]
  // },
]



export const routes: Routes = [
  ...rutasPubilcas,
  ...rutasPrivadas,
];
