import { Component, inject } from '@angular/core';
import { CuantoDinero } from "../../../public/home/simulador/cuanto-dinero";
import { TokenService } from '../../../../services/auth/token/token.service';

@Component({
  selector: 'app-simular-ysolicitar',
  imports: [CuantoDinero],
  templateUrl: './simular-ysolicitar.html',
  styleUrl: './simular-ysolicitar.css',
})
export class SimularYsolicitar {
  private serviceToken = inject(TokenService)


  name = this.serviceToken.getFromToken('name')
  lastName = this.serviceToken.getFromToken('lastName')
  nombreCompleto = this.name + ' ' + this.lastName
}
