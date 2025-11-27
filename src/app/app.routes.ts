import { Routes } from '@angular/router';
import { CuantoDinero } from './components/public/home/simulador/cuanto-dinero';
import { PasosSimulador } from './components/dashboard/dashboard';
import { Login } from './components/public/login/login';
import { Administracion } from './components/dashboard/administracion/administracion';
import { Perfil } from './components/dashboard/administracion/perfil/perfil';
import { Tasas } from './components/dashboard/administracion/tasas/tasas';
import { PerfilesDeRiesgo } from './components/dashboard/administracion/perfiles-de-riesgo/perfiles-de-riesgo';
import { Reglas } from './components/dashboard/administracion/reglas/reglas';
import { Home } from './components/public/home/home';
import { Inicio } from './components/public/home/inicio/inicio';
import { Nosotros } from './components/public/home/nosotros/nosotros';
import { Register } from './components/public/register/register';
import { PanelUser } from './components/dashboard/panel-user/panel-user';
import { PerfilUser } from './components/dashboard/panel-user/perfil-user/perfil-user';
import { SimularYsolicitar } from './components/dashboard/panel-user/simular-ysolicitar/simular-ysolicitar';
import { PreAprobados } from './components/dashboard/panel-user/pre-aprobados/pre-aprobados';
import { Prestamos } from './components/dashboard/panel-user/prestamos/prestamos';


const titulosRutas = {
  inicio: 'CrediTest | Inicio',
  nosotros: 'CrediTest | Nosotros',
  login: 'CrediTest | Login',
  register: 'CrediTest | Registrarse',
  simulador: 'CrediTest | Simula tu credito',
  cuantoDineroNecesitas: 'CrediTest | Simulador',
  administacion: 'CrediTest | Administración',
  PerfilAdmin: 'CrediTest | Perfil Administracion',
  tasas: 'CrediTest | Tasas de interés',
  perfilRiesgo: 'CrediTest | Perfiles de riesgo',
  reglas: 'CrediTest | Reglas de negocio',
  panelUser: 'CrediTest | Panel de usuario',
  PerfilUser: 'CrediTest | Perfil de usuario',
  simularYsolicitar: 'CrediTest | Simular y solicitar',
  preaprobados: 'CrediTest | Pre-aprobados',
  prestamos: 'CrediTest | Mis prestamos'
}

const rutasPubilcas: Routes = [
  { path: '', redirectTo: '/home/(home:inicio)', pathMatch: 'full' },

  {
    path: 'home', component: Home, children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: Inicio, title: titulosRutas.inicio, outlet: 'home' },
      { path: 'simulador', component: CuantoDinero, title: titulosRutas.cuantoDineroNecesitas, outlet: 'home' },
      { path: 'nosotros', component: Nosotros, title: titulosRutas.nosotros, outlet: 'home' }
    ]
  },




  { path: 'login', component: Login, title: titulosRutas.login },
  { path: 'register', component: Register, title: titulosRutas.register },
  {
    path: 'dashboard', component: PasosSimulador, title: titulosRutas.simulador, children: [

      {
        path: 'admin', component: Administracion, title: titulosRutas.administacion, children: [
          { path: 'perfil', component: Perfil, title: titulosRutas.PerfilAdmin },
          { path: 'tasas', component: Tasas, title: titulosRutas.tasas },
          { path: 'perfil-riesgo', component: PerfilesDeRiesgo, title: titulosRutas.perfilRiesgo },
          { path: 'reglas', component: Reglas, title: titulosRutas.reglas }
        ]
      },

      {
        path: 'panel-user', component: PanelUser, title: titulosRutas.panelUser, children:[
          { path: 'perfilUser', component: PerfilUser, title: titulosRutas.PerfilUser },
          { path: 'simularYsolicitar', component: SimularYsolicitar, title: titulosRutas.simularYsolicitar},
          { path: 'preaprobados', component: PreAprobados, title: titulosRutas.preaprobados},
          { path: 'prestamos', component: Prestamos, title: titulosRutas.prestamos}

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
