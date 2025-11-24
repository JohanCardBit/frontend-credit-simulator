import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { Inicio } from "./inicio/inicio";

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
