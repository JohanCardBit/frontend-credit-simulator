import { Routes } from '@angular/router';
import { CuantoDinero } from './components/dashboard/simulador/cuanto-dinero';
import { PasosSimulador } from './components/dashboard/dashboard';
import { Login } from './components/public/login/login';
import { Administracion } from './components/dashboard/administracion/administracion';
import { Perfil } from './components/dashboard/administracion/perfil/perfil';


const titulosRutas = {
  login: 'CrediTest | Login',
  simulador: 'CrediTest | Simula tu credito',
  cuantoDineroNecesitas: 'CrediTest | ¿Cuánto dinero necesitas?',
  administacion: 'CrediTest | Administración',
  PerfilAdmin: 'CrediTest | Perfil Administracion'
}

const rutasPubilcas: Routes = [
  { path: '', redirectTo: 'dashboard/simulador', pathMatch: 'full' },


  { path: 'login', component: Login, title: titulosRutas.login },
  {
    path: 'dashboard', component: PasosSimulador, title: titulosRutas.simulador, children: [
      { path: 'simulador', component: CuantoDinero, title: titulosRutas.cuantoDineroNecesitas },
      {
        path: 'admin', component: Administracion, title: titulosRutas.administacion, children: [
          { path: 'perfil', component: Perfil, title: titulosRutas.PerfilAdmin }
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
