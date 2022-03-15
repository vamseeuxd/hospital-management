import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, of} from "rxjs";
import {map} from "rxjs/operators";
import {User} from "../models/user";
import {environment} from "src/environments/environment";
import {Auth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {UsersService} from "../../data-base/users/users.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UsersService,
    private auth: Auth,
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem("currentUser")));
    this.currentUser = this.currentUserSubject.asObservable();
    this.auth.onAuthStateChanged(value => {
      if (value) {
        this.userService.getUserById(value.uid).subscribe(
          /*const subscription = this.userService.getUsersByMobile(value.phoneNumber, false).subscribe(*/
          userFinal => {
            // subscription.unsubscribe();
            const maleUrl = 'assets/images/male.png';
            const femaleUrl = 'assets/images/female.png';
            const user: User = {
              id: value.uid,
              gender: userFinal.gender,
              img: userFinal.gender === 'male' ? maleUrl : femaleUrl,
              password: '',
              firstName: userFinal.firstName,
              role: userFinal.role,
              lastName: userFinal.lastName,
              token: value.uid,
              username: value.phoneNumber
            };
            debugger;
            localStorage.setItem("currentUser", JSON.stringify(user));
            this.currentUserSubject.next(user);
          });
      } else {
        this.logout();
      }
    });
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/authenticate`, {
        username,
        password,
      })
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem("currentUser", JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  logout() {
    this.auth.signOut();
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
    return of({success: false});
  }
}
