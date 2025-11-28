import { Component, inject } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { TokenService } from '../../../services/auth/token/token.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FlashyService } from '../../../services/flashy/flashy.service';

@Component({
  selector: 'app-panel-user',
  imports: [RouterOutlet,RouterLink,RouterLinkActive],
  templateUrl: './panel-user.html',
  styleUrl: './panel-user.css',
})
export class PanelUser {
userService = inject(UserService)
  tokenService = inject(TokenService)
  flashyService = inject(FlashyService)

  idUser! : any
  user! : any

  constructor(private router: Router) { }

  ngOnInit() {
    this.idUser = this.tokenService.getFromToken('id')
    this.getUser(this.idUser)
  }

  getUser(idUser: any) {
    this.userService.getUser(idUser).subscribe({
      next: (res: any) => {
        this.user = res
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

    cerrarSesion() {
    this.flashyService.confirm('¿Estas seguro de cerrar sesion?', {
      position: 'top-center',
      animation: 'bounce',
      onConfirm: () => {
        this.tokenService.logOut();
        this.router.navigate(['/']);
        window.location.href = '/';
      },
      onCancel: () => {
        this.flashyService.info('Cierre de sesion cancelada.', { duration: 5000 });
      }
    })
  }

}
