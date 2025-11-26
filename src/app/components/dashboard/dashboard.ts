import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { TokenService } from '../../services/auth/token/token.service';
import { FlashyService } from '../../services/flashy/flashy.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class PasosSimulador {
  tokenService = inject(TokenService);
  currentYear = new Date().getFullYear();
  flashyService = inject(FlashyService);

  mostrarResultados = false;

  constructor(private router: Router) { }

  cerrarSesion() {
    this.flashyService.confirm('¿Estas seguro de cerrar sesion?', {
      position: 'top-center',
      animation: 'bounce',
      onConfirm: () => {
        this.tokenService.logOut();
        this.router.navigate(['/']);
      },
      onCancel: () => {
        this.flashyService.info('Cierre de sesion cancelada.', { duration: 5000 });
      }
    })
  }
}
