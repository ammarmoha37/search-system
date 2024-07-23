import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment.prod';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';
  private userDataKey = 'user_data';
  private userDataSubject = new BehaviorSubject<any>(null);
  userData$ = this.userDataSubject.asObservable();
  private loginStatusSubject = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginStatusSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          if (response.access_token) {
            localStorage.setItem(this.tokenKey, response.access_token);
            this.fetchUserData().subscribe(() => {
              this.loginStatusSubject.next(true);
            });
          }
        }),
      );
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refresh`, {}).pipe(
      tap((response) => {
        if (response.access_token) {
          localStorage.setItem(this.tokenKey, response.access_token);
        }
      }),
    );
  }

  logout(): Observable<any> {
    const token = this.getToken();
    return this.http
      .post<any>(
        `${this.apiUrl}/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .pipe(
        tap(() => {
          localStorage.removeItem(this.tokenKey);
          localStorage.removeItem(this.userDataKey);
          this.userDataSubject.next(''); // Clear user data on logout
          this.loginStatusSubject.next(false); // Notify of logout
        }),
      );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  fetchUserData(): Observable<any> {
    const token = this.getToken();
    return this.http
      .get<any>(`${this.apiUrl}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        tap((userData) => {
          localStorage.setItem(this.userDataKey, JSON.stringify(userData));
          this.userDataSubject.next(userData);
        }),
      );
  }

}
