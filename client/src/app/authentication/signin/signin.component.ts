import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {AuthService} from "src/app/core/service/auth.service";
import {Role} from "src/app/core/models/role";
import {UnsubscribeOnDestroyAdapter} from "src/app/shared/UnsubscribeOnDestroyAdapter";
import {UsersService} from "../../data-base/users/users.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {OtpService} from "../../shared-components/otp-service/otp.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {OtpDialogComponent} from "../../shared-components/otp-dialog/otp-dialog.component";
import {NgxSpinnerService} from "ngx-spinner";
// @ts-ignore
import * as firebase from "firebase";
import {browserLocalPersistence, browserSessionPersistence, RecaptchaVerifier, setPersistence} from "firebase/auth";
import {Auth, signInWithPhoneNumber} from "@angular/fire/auth";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements AfterViewInit {
  private confirmationResult: firebase.auth.ConfirmationResult;
  @ViewChild('signInForm') signInForm: NgForm;
  authForm: FormGroup;
  submitted = false;
  loading = false;
  error = "";
  hide = true;
  rememberMe = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private otpService: OtpService,
    private router: Router,
    private auth: Auth,
    private dialogModel: MatDialog,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private usersService: UsersService,
    private authService: AuthService
  ) {
    super();
  }

  ngAfterViewInit() {

    this.subs.add(this.authService.currentUser.subscribe(async user => {
        await this.spinner.hide("wait");
        if (user) {
          if (user.role === Role.All || user.role === Role.Admin) {
            await this.router.navigate(["/admin/dashboard/main"]);
          } else if (user.role === Role.Doctor) {
            await this.router.navigate(["/doctor/dashboard"]);
          } else if (user.role === Role.Patient) {
            await this.router.navigate(["/patient/dashboard"]);
          } else {
            await this.router.navigate(["/authentication/signin"]);
          }
        }
      })
    );

    this.authForm = this.formBuilder.group({
      username: ["admin@hospital.org", Validators.required],
      password: ["admin@123", Validators.required],
    });
    (window as any).recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
      size: 'invisible',
      callback: (response) => {
      }
    }, this.auth);
  }

  get f() {
    return this.authForm.controls;
  }

  adminSet() {
    this.authForm.get("username").setValue("admin@hospital.org");
    this.authForm.get("password").setValue("admin@123");
  }

  doctorSet() {
    this.authForm.get("username").setValue("doctor@hospital.org");
    this.authForm.get("password").setValue("doctor@123");
  }

  patientSet() {
    this.authForm.get("username").setValue("patient@hospital.org");
    this.authForm.get("password").setValue("patient@123");
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.error = "";
    if (this.authForm.invalid) {
      this.error = "Username and Password not valid !";
      return;
    } else {
      this.subs.sink = this.authService
        .login(this.f.username.value, this.f.password.value)
        .subscribe(
          (res) => {
            if (res && this.authService.currentUserValue) {
              setTimeout(() => {
                const role = this.authService.currentUserValue.role;
                if (role === Role.All || role === Role.Admin) {
                  this.router.navigate(["/admin/dashboard/main"]);
                } else if (role === Role.Doctor) {
                  this.router.navigate(["/doctor/dashboard"]);
                } else if (role === Role.Patient) {
                  this.router.navigate(["/patient/dashboard"]);
                } else {
                  this.router.navigate(["/authentication/signin"]);
                }
                this.loading = false;
              }, 1000);
            } else {
              this.error = "Invalid Login";
            }
          },
          (error) => {
            this.error = error;
            this.submitted = false;
            this.loading = false;
          }
        );
    }
  }

  async loginWithMobile(signInForm: NgForm) {
    this.snackBar.dismiss();
    this.loading = true;
    await setPersistence(this.auth, this.rememberMe ? browserLocalPersistence : browserSessionPersistence);
    await this.spinner.show('wait');
    const getUsersByMobileSubscription = this.usersService.getUsersByMobile(signInForm.value.mobile).subscribe(
      async value => {
        this.loading = false;
        getUsersByMobileSubscription.unsubscribe();
        if (value.length > 0) {
          try {
            this.confirmationResult = await signInWithPhoneNumber(
              this.auth, '+91' + this.signInForm.value.mobile,
              (window as any).recaptchaVerifier
            );
            await this.showOTPDialog();
          } catch (e) {
            this.snackBar.open(e, 'OK');
          }
        } else {
          await this.spinner.hide('wait');
          this.snackBar.open('This Mobile Number is Not Registered. Please Register to Continue', 'OK', {duration: 10000});
        }
      }
    );
  }

  async showOTPDialog() {
    this.otpService.openMobileOtpDialog(
      '+91' + this.signInForm.value.mobile,
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
    // await this.spinner.hide('wait');
    await this.spinner.show("wait");
    await this.confirmationResult.confirm(details.mobileOtp);
    await this.spinner.hide("wait");
    dialogRef.close();
  }
}
