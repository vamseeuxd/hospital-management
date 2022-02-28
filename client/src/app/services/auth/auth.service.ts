import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
// @ts-ignore
import { Observable, Subject, tap } from 'rxjs';
import { Router } from '@angular/router';

export type Role = 'user' | 'staff' | 'admin';

export interface IRegister {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IUser {
  role: Role;
  firstName: string;
  lastName: string;
  email: string;
  id: string;
}

export interface IRegisterResponse {
  token: string;
  user: IUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _registerUrl = `${environment.apiPath}auth/register`;
  private _loginUrl = `${environment.apiPath}auth/login`;
  private userAction: Subject<IUser> = new Subject<IUser>();
  user$: Observable<IUser> = this.userAction.asObservable();

  constructor(private http: HttpClient, private _router: Router) {}

  register(value: IRegister): Observable<IRegisterResponse> {
    return this.http.post<IRegisterResponse>(this._registerUrl, value).pipe(
      tap((value: IRegisterResponse) => {
        this.userAction.next(value.user);
      })
    );
  }

  login(email: string, password: string): Observable<IRegisterResponse> {
    return this.http
      .post<IRegisterResponse>(this._loginUrl, {
        email,
        password,
      })
      .pipe(
        tap((value: IRegisterResponse) => {
          this.userAction.next(value.user);
        })
      );
  }

  user(): Observable<any> {
    return this.http.get<any>(`${environment.apiPath}user/current`);
  }

  logoutUser() {
    localStorage.removeItem('token');
    this._router.navigate(['/events']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }
}
