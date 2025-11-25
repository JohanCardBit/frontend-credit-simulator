import { Component, inject } from '@angular/core';
import { PerfilesService } from '../../../../services/perfilesRiesgo/perfiles.service';

@Component({
  selector: 'app-perfiles-de-riesgo',
  imports: [],
  templateUrl: './perfiles-de-riesgo.html',
  styleUrl: './perfiles-de-riesgo.css',
})
export class PerfilesDeRiesgo {
  perfilRiesgoService = inject(PerfilesService)

  perfiles: any[] = []

  ngOnInit() {
    this.getPerfilesRiesgo()
  }

  getPerfilesRiesgo() {
    this.perfilRiesgoService.getRiskProfiles().subscribe({
      next: (res: any) => {
       this.perfiles = res
       console.log(res);

      },
      error: (error: any) => {
        console.log(error);
      }
    })

  }
}
