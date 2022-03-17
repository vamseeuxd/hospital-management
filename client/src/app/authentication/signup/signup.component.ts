import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, NgForm} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {Auth, signInWithPhoneNumber, updateEmail, updateProfile} from "@angular/fire/auth";
import {RecaptchaVerifier} from "firebase/auth";
import {OtpService} from "../../shared-components/otp-service/otp.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UsersService} from "../../data-base/users/users.service";
import {OtpDialogComponent} from "../../shared-components/otp-dialog/otp-dialog.component";
// @ts-ignore
import * as firebase from "firebase";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements AfterViewInit {
  @ViewChild('registrationForm') registrationForm: NgForm;
  showOtpScreen = true;
  private confirmationResult: firebase.auth.ConfirmationResult;

  constructor(
    private auth: Auth,
    private userService: UsersService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private otpService: OtpService,
    private dialogModel: MatDialog,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    /*linkWithPhoneNumber();
    reauthenticateWithPhoneNumber()
    signInWithPhoneNumber()
    updatePhoneNumber()*/
    this.auth.settings.appVerificationDisabledForTesting = true;
  }

  async ngAfterViewInit() {
    (window as any).recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
      size: 'invisible',
      callback: (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        this.onSignInSubmit();
      }
    }, this.auth);
    setTimeout(() => {
      this.registrationForm.resetForm({
        mobile: '9962266742',
        email: 'vamsi.flex@gmail.com',
        firstName: 'Vamsee Kalyan',
        lastName: 'Sunkara',
        gender: 'male',
      });
    }, 5);
    await this.spinner.hide("wait");
  }

  async showOTPDialog() {
    this.otpService.openMobileOtpDialog(
      '+91' + this.registrationForm.value.mobile,
      this.dialogModel,
      this.snackBar,
      this.cancelOTP.bind(this),
      this.resendOTP.bind(this),
      this.verifyOTP.bind(this)
    );
    await this.spinner.hide('wait');
  }

  cancelOTP(dialogRef: MatDialogRef<OtpDialogComponent>) {
    dialogRef.close();
  }

  resendOTP(dialogRef: MatDialogRef<OtpDialogComponent>) {
    dialogRef.close();
  }

  async verifyOTP(details: { mobile: string; mobileOtp: string; }, dialogRef: MatDialogRef<OtpDialogComponent>) {
    try {
      await this.spinner.show("wait");
      const {user} = await this.confirmationResult.confirm(details.mobileOtp);
      if (user) {
        try {
          await this.userService.addUser(
            {
              ...this.registrationForm.value,
              mobile: `+91${this.registrationForm.value.mobile}`,
              picture: this.registrationForm.value.gender + '.png',
              role: 'Patient',
            });
          await updateProfile(
            this.auth.currentUser,
            {displayName: `${this.registrationForm.value.firstName} ${this.registrationForm.value.lastName}`}
          );
          await updateEmail(this.auth.currentUser, this.registrationForm.value.email);
          this.snackBar.open('Registration Successful, Now you can login with mobile', 'OK', {duration: 100000});
          dialogRef.close();
          setTimeout(async () => {
            await this.auth.signOut();
            await this.spinner.hide('wait');
            await this.router.navigate(["/admin/dashboard/main"]);
          }, 500);
        } catch (e) {
          this.snackBar.open(e, 'OK');
        }
      }
    } catch (e) {
      this.snackBar.open(e, 'OK');
    }
  }


  async onSubmit() {
    await this.spinner.show("wait");
    const getUsersByMobileSubscription = this.userService.getUsersByMobile(this.registrationForm.value.mobile).subscribe(async (value) => {
      getUsersByMobileSubscription.unsubscribe();
      if (value.length === 0) {
        try {
          this.confirmationResult = await signInWithPhoneNumber(
            this.auth, '+91' + this.registrationForm.value.mobile,
            (window as any).recaptchaVerifier
          );
          await this.showOTPDialog();
        } catch (e) {
          this.snackBar.open(e, 'OK');
        }
      } else {
        this.snackBar.open(`Mobile Number Already Registered`, 'OK');
        await this.spinner.hide('wait');
      }
    }, async (error) => {
      this.snackBar.open(error, 'OK');
    });
  }

  private onSignInSubmit() {
  }
}
