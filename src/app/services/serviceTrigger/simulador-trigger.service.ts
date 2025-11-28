import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SimuladorTriggerService {
  private ejecutarSubject = new Subject<void>();
  ejecutar$ = this.ejecutarSubject.asObservable();

  ejecutarAcciones() {
    this.ejecutarSubject.next();
  }
}
