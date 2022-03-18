import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot,} from "@angular/router";

import {AuthService} from "../service/auth.service";
import {Role} from "../models/role";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.currentUserValue) {
      const userRole = this.authService.currentUserValue.role;
      if (route.data.role && route.data.role.indexOf(userRole) === -1) {
        switch (userRole) {
          case Role.Admin:
            this.router.navigate(["/admin/dashboard/main"]);
            break;
          case Role.Doctor:
            this.router.navigate(["/doctor/dashboard"]);
            break;
          case Role.Patient:
            this.router.navigate(["/patient/dashboard"]);
            break;
          default:
            this.authService.logout();
            this.router.navigate(["/authentication/signin"]);
            break;
        }
        return false;
      }
      return true;
    }

    this.router.navigate(["/authentication/signin"]);
    return false;
  }
}
