import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const blockGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cookieService = inject(CookieService);

  const token = cookieService.get('token');

  if (token) {
    // Si ya hay token, redirige al panel principal
    router.navigate(['/dashboard/panel-user/simularYsolicitar']);
    return false;
  }

  return true; // No hay token → puede acceder a login/registro/home
};
