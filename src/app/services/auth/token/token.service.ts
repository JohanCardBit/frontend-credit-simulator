import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../environments/api-url';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
   private apiUrl: string = ApiUrl.url;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  getFromToken(variable: string) {
    const token = this.cookieService.get('token');

    if (!token) {
      return 'no hay token valido';
    }

    try {
      const decoded: any = jwtDecode(token);
      return decoded?.[variable] || null;
    } catch (error) {
      console.log('Error al decodificar el token:', error);
      return null;
    }
  }


  logOut() {
  const cookies = this.cookieService.getAll();

  for (const cookieName of Object.keys(cookies)) {
    this.cookieService.delete(cookieName, '/');       // cookies con path /
    this.cookieService.delete(cookieName);            // cookies sin path
    this.cookieService.delete(cookieName, '/', window.location.hostname); // cookies con dominio
  }
}

  // linkRecoverPassword(email: string) {
  //   return this.http.post(`${this.apiUrl}/reset-password/email`, { email });
  // }
}
