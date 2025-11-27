import { Component, inject } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { TokenService } from '../../../services/auth/token/token.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-panel-user',
  imports: [RouterOutlet,RouterLink,RouterLinkActive],
  templateUrl: './panel-user.html',
  styleUrl: './panel-user.css',
})
export class PanelUser {
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
