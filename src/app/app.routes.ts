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
import { Forms } from './components/private/forms/forms';
import { blockGuard } from './guards/block/block-guard';
import { authGuard } from './guards/auth/auth-guard';


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
  prestamos: 'CrediTest | Mis prestamos',
  forms: 'CrediTest | Formulario de credito'
}

const rutasPubilcas: Routes = [
  { path: '', redirectTo: '/home/(home:inicio)', pathMatch: 'full' },

  {
    path: 'home', component: Home, canActivate: [blockGuard], children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: Inicio, title: titulosRutas.inicio, outlet: 'home' },
      { path: 'simulador', component: CuantoDinero, title: titulosRutas.cuantoDineroNecesitas, outlet: 'home' },
      { path: 'nosotros', component: Nosotros, title: titulosRutas.nosotros, outlet: 'home' }
    ]
  },

  { path: 'login', component: Login, canActivate: [blockGuard], title: titulosRutas.login },
  { path: 'register', component: Register, canActivate: [blockGuard], title: titulosRutas.register },
]


const rutasPrivadas: Routes = [
  { path: 'formulario', component: Forms, canActivate: [authGuard], title: titulosRutas.forms },

  {
    path: 'dashboard', component: PasosSimulador, canActivate: [authGuard], canActivateChild: [authGuard], title: titulosRutas.simulador, children: [

      {
        path: 'admin', component: Administracion, children: [
          { path: 'perfil', component: Perfil, title: titulosRutas.PerfilAdmin },
          { path: 'tasas', component: Tasas, title: titulosRutas.tasas },
          { path: 'perfil-riesgo', component: PerfilesDeRiesgo, title: titulosRutas.perfilRiesgo },
          { path: 'reglas', component: Reglas, title: titulosRutas.reglas }
        ]
      },

      {
        path: 'panel-user', component: PanelUser, canActivateChild: [authGuard], children: [
          { path: 'perfilUser', component: PerfilUser, title: titulosRutas.PerfilUser },
          { path: 'simularYsolicitar', component: SimularYsolicitar, title: titulosRutas.simularYsolicitar },
          { path: 'preaprobados', component: PreAprobados, title: titulosRutas.preaprobados },
          { path: 'prestamos', component: Prestamos, title: titulosRutas.prestamos }
        ]
      }

    ]
  },
]


export const routes: Routes = [
  ...rutasPubilcas,
  ...rutasPrivadas,
];
