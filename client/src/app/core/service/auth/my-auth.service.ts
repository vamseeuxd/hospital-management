import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
// @ts-ignore
import { delay, Observable, Subject, tap } from "rxjs";
import { Router } from "@angular/router";
import { IRegister, IRegisterResponse, IUser } from "../auth.service";
import { OtpDialogComponent } from "../../../shared-components/otp-dialog/otp-dialog.component";
import { NgxSpinnerService } from "ngx-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";

@Injectable({
  providedIn: "root",
})
export class MyAuthService {
  private _registerUrl = `${environment.apiPath}auth/register`;
  private _loginUrl = `${environment.apiPath}auth/login`;
  private _sendMobileVerificationOtpUrl = `${environment.apiPath}auth/send-mobile-verification-otp`;
  private _verifyMobileOtpUrl = `${environment.apiPath}auth/verify-mobile-otp`;
  private userAction: Subject<IUser> = new Subject<IUser>();
  user$: Observable<IUser> = this.userAction.asObservable();

  constructor(
    private http: HttpClient,
    private _router: Router,
    private spinner: NgxSpinnerService
  ) {}

  register(value: IRegister): Observable<IRegisterResponse> {
    return this.http.post<IRegisterResponse>(this._registerUrl, value).pipe(
      tap((value: IRegisterResponse) => {
        this.userAction.next(value.user);
        debugger;
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

  sendMobileVerificationOtp(mobile: string): Observable<IRegisterResponse> {
    return this.http
      .post<IRegisterResponse>(this._sendMobileVerificationOtpUrl, {
        mobile,
      })
      .pipe(
        tap((value: IRegisterResponse) => {
          this.userAction.next(value.user);
        })
      );
  }

  verifyMobileOtp(
    mobile: string,
    mobileOtp: string
  ): Observable<IRegisterResponse> {
    return this.http
      .post<IRegisterResponse>(this._verifyMobileOtpUrl, {
        mobile,
        mobileOtp,
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
    localStorage.removeItem("token");
    this._router.navigate(["/events"]);
  }

  getToken() {
    return localStorage.getItem("token");
  }

  loggedIn() {
    return !!localStorage.getItem("token");
  }

  openMobileOtpDialog(
    mobile: string,
    dialogModel: MatDialog,
    _snackBar: MatSnackBar
  ): void {
    const dialogRef = dialogModel.open(OtpDialogComponent, {
      width: "640px",
      disableClose: true,
    });
    dialogRef.componentInstance.mobileNumber = mobile;
    const sub1 = dialogRef.componentInstance.cancel.subscribe(async () => {
      sub1.unsubscribe();
      sub2.unsubscribe();
      sub3.unsubscribe();
      dialogRef.close();
      await this._router.navigate(["/authentication/signin"]);
    });
    const sub2 = dialogRef.componentInstance.verify.subscribe(
      async ({ mobile, mobileOtp }) => {
        await this.spinner.show("wait");
        const sub5 = this.verifyMobileOtp(mobile, mobileOtp)
          .pipe(delay(1000))
          .subscribe(
            async (value) => {
              console.log(value);
              sub5.unsubscribe();
              dialogRef.close();
              await this.spinner.hide("wait");
              await this._router.navigate(["/authentication/signin"]);

              _snackBar.open("Mobile Number Validation Successful", "OK", {
                duration: 5000,
              });
            },
            async (error) => {
              console.log(error);
              _snackBar.open(error, "OK", { duration: 5000 });
              sub5.unsubscribe();
              await this.spinner.hide("wait");
            }
          );
      }
    );
    const sub3 = dialogRef.componentInstance.resendOtp.subscribe(
      async (mobile) => {
        await this.spinner.show("wait");
        const sub4 = this.sendMobileVerificationOtp(mobile).subscribe(
          async (value) => {
            console.log(value);
            sub4.unsubscribe();
            await this.spinner.hide("wait");
          },
          async (error) => {
            console.log(error);
            _snackBar.open(error, "OK", { duration: 5000 });
            sub4.unsubscribe();
            await this.spinner.hide("wait");
          }
        );
      }
    );
  }
}
