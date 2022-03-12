import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {OtpDialogComponent} from "../otp-dialog/otp-dialog.component";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OtpService {

  constructor(
    private http: HttpClient,
    // tslint:disable-next-line:variable-name
    private _router: Router,
    private spinner: NgxSpinnerService
  ) {
  }

  openMobileOtpDialog(
    mobileNumber: string,
    dialogModel: MatDialog,
    // tslint:disable-next-line:variable-name
    _snackBar: MatSnackBar,
    cancelCallBack: (ref: MatDialogRef<OtpDialogComponent>) => void,
    resendOtpCallBack: (ref: MatDialogRef<OtpDialogComponent>) => void,
    verifyCallBack: (details: { mobile: string; mobileOtp: string; }, ref: MatDialogRef<OtpDialogComponent>) => void,
    successMessage = "Mobile Number Validation Successful"
  ): void {
    const dialogRef = dialogModel.open(OtpDialogComponent, {width: "640px", disableClose: true});
    dialogRef.componentInstance.mobileNumber = mobileNumber;
    const subscription = dialogRef.afterClosed().subscribe(value => {
      console.log('Cloded the Mat-Dialog');
      subscription.unsubscribe();
      subscriptions.forEach(ref => ref.unsubscribe());
    });
    const subscriptions: Subscription[] = [
      dialogRef.componentInstance.resendOtp.subscribe(
        () => {
          resendOtpCallBack(dialogRef);
        }
      ),
      dialogRef.componentInstance.verify.subscribe(
        (details) => {
          verifyCallBack(details, dialogRef);
        }
      ),
      dialogRef.componentInstance.cancel.subscribe(
        () => {
          cancelCallBack(dialogRef);
        }
      ),
    ];
  }
}
