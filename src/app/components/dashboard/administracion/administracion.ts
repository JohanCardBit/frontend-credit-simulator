import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive, Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { TokenService } from '../../../services/auth/token/token.service';
import { FlashyService } from '../../../services/flashy/flashy.service';


@Component({
  selector: 'app-administracion',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './administracion.html',
  styleUrl: './administracion.css',
})
export class Administracion {
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
