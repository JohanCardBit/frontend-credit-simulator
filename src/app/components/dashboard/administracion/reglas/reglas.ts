import { Component, inject } from '@angular/core';
import { ReglasService } from '../../../../services/reglas/reglas.service';

@Component({
  selector: 'app-reglas',
  imports: [],
  templateUrl: './reglas.html',
  styleUrl: './reglas.css',
})
export class Reglas {
  reglasService = inject(ReglasService)

  reglas: any[] = []

  ngOnInit() {
    this.getReglas()
  }

  getReglas() {
    this.reglasService.getBusinessRules().subscribe({
      next: (data: any) => {
        console.log(data.data)
        this.reglas = data.data
      },
      error: (error: any) => {
        console.log(error)
      }
    })
  }
}
