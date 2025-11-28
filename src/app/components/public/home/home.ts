import { Component, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
declare var bootstrap: any;


@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class Home {



closeNavbar() {
  const navbar = document.getElementById('navbarNav');
  if (navbar) {
    const collapse = bootstrap.Collapse.getOrCreateInstance(navbar);
    collapse.hide();
  }
}




}
