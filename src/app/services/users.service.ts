import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.prod';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = environment.apiUrl;

  // constructor(private http: HttpClient) {}

  // // Fetch data
  // getDefaultVideoData(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/user`);
  // }

  // // Send data
  // postData(data: any) {
  //   return this.http.post(`${this.apiUrl}/user`, data);
  // }

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  // Fetch data
  getDefaultUserData(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.apiUrl}/user`, { headers });
  }

  // Send data
  postData(data: any) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.apiUrl}/users`, data, { headers });
  }
}
