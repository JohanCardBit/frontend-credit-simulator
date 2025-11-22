import { Injectable } from '@angular/core';
import { ApiUrl } from '../../environments/api-url';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TasasService {
  private apiUrl: string = ApiUrl.url

  constructor(private http: HttpClient) {}


  private getTokenFromCookies(): string | null {
    const cookies = document.cookie.split(';').map(c => c.trim());
    const tokenCookie = cookies.find(c => c.startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  }

  header() {
    const token = this.getTokenFromCookies();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}`
    });
    return headers;
  }

  getRates(){
    const headers = this.header();
    return this.http.get(`${this.apiUrl}/interest_rates`, { headers });
  }
}
