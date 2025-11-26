import { Injectable } from '@angular/core';
import { ApiUrl } from '../../environments/api-url';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ReglasService {
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

  getBusinessRules() {
    return this.http.get(`${this.apiUrl}/businessrules`, );
  }

  getOneBusinessRule(idRule: any) {
    const headers = this.header();
    return this.http.get(`${this.apiUrl}/businessrules/${idRule}`, { headers });
  }

  createBusinessRule(data: any) {
    const headers = this.header();
    return this.http.post(`${this.apiUrl}/businessrules/create`, data, { headers });
  }

  updateBusinessRule(idRule: any, data: any) {
    const headers = this.header();
    return this.http.put(`${this.apiUrl}/businessrules/update/${idRule}`, data, { headers });
  }

  deleteBusinessRule(idRule: any) {
    const headers = this.header();
    return this.http.delete(`${this.apiUrl}/businessrules/delete/${idRule}`, { headers });
  }
}
