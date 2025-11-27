import { Component, inject } from '@angular/core';
import { PrestamoService } from '../../../../services/prestamos/prestamo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prestamos',
  imports: [CommonModule],
  templateUrl: './prestamos.html',
  styleUrl: './prestamos.css',
})
export class Prestamos {
  private servicePrestamo = inject(PrestamoService);

  prestamos!:any

  ngOnInit(){
    this.obtenerPrestamos()
  }

  obtenerPrestamos(){
    this.servicePrestamo.getLoans().subscribe({
      next: (res: any) => {
        this.prestamos = res
        console.log(res);
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

}
