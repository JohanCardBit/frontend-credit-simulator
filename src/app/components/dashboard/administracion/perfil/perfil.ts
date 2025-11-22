import { Component, inject } from '@angular/core';
import { UserService } from '../../../../services/user/user.service';
import { TokenService } from '../../../../services/auth/token/token.service';

@Component({
  selector: 'app-perfil',
  imports: [],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  userService = inject(UserService)
  tokenService = inject(TokenService)

  idUser! : any
  user! : any

  ngOnInit() {
    this.idUser = this.tokenService.getFromToken('id')
    console.log(this.idUser);
    this.getUser(this.idUser)

  }

  getUser(idUser: any) {
    this.userService.getUser(idUser).subscribe({
      next: (res: any) => {
        this.user = res
        console.log(this.user);
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }
}
