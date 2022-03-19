import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";

import {AuthService} from "../service/auth.service";
import {Auth} from "@angular/fire/auth";
import {of, switchMap} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private auth: Auth) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.currentUser.pipe(switchMap(value => {
      console.clear();
      // console.log(route.data && route.data.role && route.data.role.toLowerCase() === value.role.toLowerCase());
      if (route.data && route.data.role && value && value.role) {
        return of(route.data.role.toLowerCase() === value.role.toLowerCase());
      } else if (route.data && route.data.role) {
        this.router.navigate(["/authentication/signin"]);
        return of(false);
      } else {
        return of(true);
      }
    }));
  }
}
