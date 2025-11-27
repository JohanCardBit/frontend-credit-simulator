import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../environments/api-url';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private apiUrl: string = ApiUrl.url;

  constructor(private http: HttpClient) { }

  postRegister(data: any) {
    return this.http.post(`${this.apiUrl}/users/create`, data);
  }
}
