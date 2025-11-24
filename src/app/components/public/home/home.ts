import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { Inicio } from "./inicio/inicio";

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterLinkActive, Inicio],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
