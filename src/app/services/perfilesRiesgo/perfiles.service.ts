import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrl } from '../../environments/api-url';

@Injectable({
  providedIn: 'root',
})
export class PerfilesService {
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

  getRiskProfiles() {
    return this.http.get(`${this.apiUrl}/riskprofiles`);
  }

  getRiskProfile(idProfile: any) {
    const headers = this.header();
    return this.http.get(`${this.apiUrl}/riskprofiles/${idProfile}`, { headers });
  }

  createRiskProfile(data: any) {
    const headers = this.header();
    return this.http.post(`${this.apiUrl}/riskprofiles/create`, data, { headers });
  }

  updateRiskProfile(idProfile: any, data: any) {
    const headers = this.header();
    return this.http.put(`${this.apiUrl}/riskprofiles/update/${idProfile}`, data, { headers });
  }

  deleteRiskProfile(idProfile: any) {
    const headers = this.header();
    return this.http.delete(`${this.apiUrl}/riskprofiles/delete/${idProfile}`, { headers });
  }
}
