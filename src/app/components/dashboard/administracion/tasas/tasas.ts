import { Component, inject } from '@angular/core';
import { TasasService } from '../../../../services/tasas/tasas.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tasas',
  imports: [DatePipe],
  templateUrl: './tasas.html',
  styleUrl: './tasas.css',
})
export class Tasas {
  tasasService = inject(TasasService)

  tasasObtenidas: any[] = [];

  ngOnInit() {
    this.getRates();
  }

  getRates() {
     this.tasasService.getRates().subscribe({
       next: (res: any) => {
         this.tasasObtenidas = res
         console.log(res);
       },
       error: (error: any) => {
         console.log(error);
       }
  })
  }
}

