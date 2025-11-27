import { Component, inject, Inject } from '@angular/core';
import { SimuladorService } from '../../../../services/simulador/simulador.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pre-aprobados',
  imports: [ CommonModule],
  templateUrl: './pre-aprobados.html',
  styleUrl: './pre-aprobados.css',
})
export class PreAprobados {
  private simulacionService = inject(SimuladorService)

  preAprobados!:any

  ngOnInit(){
    this.getPreaprobados()
  }

  getPreaprobados(){
    this.simulacionService.getSimulations().subscribe({
      next: (res) => {
        this.preAprobados = res
        console.log(this.preAprobados)
      },
      error: (err) => {
        console.log(err)
      }
    })

  }


}
