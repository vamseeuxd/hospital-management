import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, Subscription, tap} from "rxjs";
import {map} from "rxjs/operators";
import {User} from "../models/user";
import {environment} from "src/environments/environment";
import {Auth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {UsersService} from "../../data-base/users/users.service";
import {getDownloadURL, getStorage, ref} from "@angular/fire/storage";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private userServiceSubscribe: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UsersService,
    private auth: Auth,
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem("currentUser")));
    this.currentUser = this.currentUserSubject.asObservable();
    this.auth.onAuthStateChanged(async value => {
      if (value) {
        this.userServiceSubscribe = this.userService.getUserById(value.uid).subscribe(
          async userFinal => {
            const maleUrl = 'assets/images/male.png';
            const femaleUrl = 'assets/images/female.png';
            let mainImage;
            if (userFinal.picture) {
              mainImage = await this.getImage(userFinal.picture);
            }
            const user: User = {
              id: value.uid,
              gender: userFinal.gender,
              img: userFinal.picture ? mainImage : (userFinal.gender === 'male' ? maleUrl : femaleUrl),
              password: '',
              firstName: userFinal.firstName,
              role: userFinal.role,
              lastName: userFinal.lastName,
              token: value.uid,
              username: value.phoneNumber
            };
            localStorage.setItem("currentUser", JSON.stringify(user));
            this.currentUserSubject.next(user);
          });
      }
    });
  }

  async getImage(picture: string) {
    const storage = getStorage();
    const pathReference = ref(storage, picture);
    return getDownloadURL(pathReference);
  }

  public get currentUserValue(): User {
    if (this.auth.currentUser) {
      return this.currentUserSubject.value;
    } else {
      localStorage.removeItem("currentUser");
      this.currentUserSubject.next(null);
      return null;
    }
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

  async logout() {
    if (this.userServiceSubscribe) {
      this.userServiceSubscribe.unsubscribe();
    }
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
    await this.auth.signOut();
  }
}
