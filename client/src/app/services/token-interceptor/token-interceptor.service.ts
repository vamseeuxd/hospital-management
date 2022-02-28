import { Injectable, Injector } from '@angular/core';
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    debugger;
    let authService = this.injector.get(AuthService);
    let tokenizedReq = req.clone({
      headers: req.headers.set(
        'Authorization',
        'Bearer ' + authService.getToken()
      ),
    });
    tokenizedReq.headers.set(
      'Authorization',
      'bearer ' + authService.getToken()
    );
    return next.handle(tokenizedReq);
  }
}
