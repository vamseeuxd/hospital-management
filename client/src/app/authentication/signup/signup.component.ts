import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MyAuthService } from "../../core/service/auth/my-auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpErrorResponse } from "@angular/common/http";
import { IRegisterResponse } from "../../core/service/auth.service";

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
    public authService: MyAuthService,
    private _snackBar: MatSnackBar
  ) {
    console.log("---------------------------------------------------");
    /*this.authService.user().subscribe(
      (value1: any) => {
        debugger;
      },
      (error) => {
        debugger;
      }
    );*/
    /*this.authService.login("vamsi.flex@gmail.com", "12345").subscribe(
      (res: IRegisterResponse) => {
        // debugger;
        localStorage.setItem("token", res.token);
        this.authService.user().subscribe((value1: any) => {
          debugger;
        });
      },
      (error: HttpErrorResponse) => {
        alert(error.error.error);
      }
    );*/
    /*this.authService
      .register({
        firstName: "Vamsee Kalyan",
        lastName: "Sunkara",
        email: "vamsi.flex@gmail.com",
        password: "12345",
      })
      .subscribe(
        (value: IRegisterResponse) => {
          debugger;
        },
        (error: HttpErrorResponse) => {
          alert(error.error);
        }
      );*/
  }

  ngOnInit() {
    /*cpassword: "12345"
        email: "vamsi.flex@gmail.com"
        firstName: "Vamsee Kalyan"
        lastName: "Sunkara"
        password: "12345"*/
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

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.authForm.invalid) {
      return;
    } else {
      if (this.authForm.value.cpassword === this.authForm.value.password) {
        console.log(this.authForm.value);

        this.authService
          .register({
            firstName: this.authForm.value.firstName,
            lastName: this.authForm.value.lastName,
            email: this.authForm.value.email,
            mobile: this.authForm.value.mobile,
            password: this.authForm.value.password,
          })
          .subscribe(
            (value: IRegisterResponse) => {
              this._snackBar.open("User Created Successfully", "OK", {
                duration: 5000,
              });
              this.router.navigate(["/admin/dashboard/main"]);
            },
            (error: HttpErrorResponse) => {
              debugger;
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
