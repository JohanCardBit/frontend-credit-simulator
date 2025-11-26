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
    this.cookieService.delete('token', '/');
  }

  // linkRecoverPassword(email: string) {
  //   return this.http.post(`${this.apiUrl}/reset-password/email`, { email });
  // }
}
