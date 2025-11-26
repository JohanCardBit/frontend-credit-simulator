import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { TokenService } from '../../../services/auth/token/token.service';


@Component({
  selector: 'app-administracion',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './administracion.html',
  styleUrl: './administracion.css',
})
export class Administracion {
userService = inject(UserService)
  tokenService = inject(TokenService)

  idUser! : any
  user! : any

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




}
