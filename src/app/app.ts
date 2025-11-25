import { Component, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend_simulador');
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {
    this.setPageTitles();
  }

  setPageTitles() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        filter(route => route.snapshot.data && route.snapshot.data['title']),
        map(route => route.snapshot.data['title'])
      )
      .subscribe((pageTitle: string) => {
        this.titleService.setTitle(pageTitle);
      });
  }
}
