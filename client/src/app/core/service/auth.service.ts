import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, of, tap } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../models/user";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private _registerUrl = `${environment.apiPath}auth/register`;
  private _loginUrl = `${environment.apiPath}auth/login`;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  register(value: IRegister): Observable<IRegisterResponse> {
    return this.http.post<IRegisterResponse>(this._registerUrl, value).pipe(
      tap((res: IRegisterResponse) => {
        localStorage.setItem("token", res.token);
      })
    );
  }

  login(email: string, password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/authenticate`, { email, password })
      .pipe(
        map((user) => {
          localStorage.setItem("currentUser", JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  getToken() {
    return localStorage.getItem("token");
  }

  user(): Observable<any> {
    return this.http.get<any>(`${environment.apiPath}user/current`);
  }

  logout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    this.currentUserSubject.next(null);
    return of({ success: false });
  }
}

export type Role = "user" | "staff" | "admin";

export interface IRegister {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
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
