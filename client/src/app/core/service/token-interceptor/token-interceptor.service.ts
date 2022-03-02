import { Injectable, Injector } from "@angular/core";
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { MyAuthService } from "../auth/my-auth.service";

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let authService = this.injector.get(MyAuthService);
    let tokenizedReq = req.clone({
      headers: req.headers.set(
        "Authorization",
        "Bearer " + authService.getToken()
      ),
    });
    tokenizedReq.headers.set(
      "Authorization",
      "bearer " + authService.getToken()
    );
    return next.handle(tokenizedReq);
  }
}
