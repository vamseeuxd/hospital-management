import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MyAuthService } from "../../core/service/auth/my-auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpErrorResponse } from "@angular/common/http";
import { IRegisterResponse } from "../../core/service/auth.service";
import { MatDialog } from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  authForm: FormGroup;
  submitted = false;
  returnUrl: string;
  hide = true;
  chide = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dialogModel: MatDialog,
    public authService: MyAuthService,
    private spinner: NgxSpinnerService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      firstName: ["Vamsee Kalyan", Validators.required],
      lastName: ["Sunkara"],
      email: [
        "vamsi.flex@gmail.com",
        [Validators.email, Validators.minLength(5)],
      ],
      mobile: [
        "9962266742",
        [
          Validators.required,
          Validators.pattern("^[0-9]{10}$"),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      password: ["12345", Validators.required],
      cpassword: ["12345", Validators.required],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  get f() {
    return this.authForm.controls;
  }

  async onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.authForm.invalid) {
      return;
    } else {
      if (this.authForm.value.cpassword === this.authForm.value.password) {
        await this.spinner.show("wait");
        // await this.spinner.show("", { bdColor: "rgba(0, 0, 0, 1)" });
        this.authService
          .register({
            firstName: this.authForm.value.firstName,
            lastName: this.authForm.value.lastName,
            email: this.authForm.value.email,
            mobile: this.authForm.value.mobile,
            password: this.authForm.value.password,
          })
          .subscribe(
            async (value: IRegisterResponse) => {
              await this.spinner.hide("wait");
              /*this._snackBar.open("User Created Successfully", "OK", {
                duration: 1000,
              });*/
              this.authService.openMobileOtpDialog(
                "9962266742",
                this.dialogModel,
                this._snackBar
              );
              // this.router.navigate(["/admin/dashboard/main"]);
            },
            async (error: HttpErrorResponse) => {
              await this.spinner.hide("wait");
              if (error && error.error) {
                this._snackBar.open(error.error, "OK", { duration: 5000 });
              } else {
                this._snackBar.open(
                  "Technical Error while Sign-Up, Please try again",
                  "OK",
                  {
                    duration: 5000,
                  }
                );
              }
            }
          );
      } else {
        this._snackBar.open("Password and Confirm Password are not same", "OK");
      }
      // this.router.navigate(["/admin/dashboard/main"]);
    }
  }
}
