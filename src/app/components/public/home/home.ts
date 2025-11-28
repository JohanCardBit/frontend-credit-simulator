import { Component, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { Inicio } from "./inicio/inicio";
import { CuantoDinero } from './simulador/cuanto-dinero';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {


  //  @ViewChild(CuantoDinero) hijo!: CuantoDinero;

  //  llamarHijo() {
  //   this.hijo.simular();
  //   }
}
