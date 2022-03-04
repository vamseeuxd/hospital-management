import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MyAuthService } from "../../core/service/auth/my-auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  authForm: FormGroup;
  submitted = false;
  returnUrl: string;
  hide = true;
  chide = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private dialogModel: MatDialog,
    public authService: MyAuthService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      mobile: [
        "",
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
    this.authService.openMobileOtpDialog(
      this.authForm.value.mobile,
      this.dialogModel,
      this._snackBar
    );
    /*this.submitted = true;
    // stop here if form is invalid
    if (this.authForm.invalid) {
      return;
    } else {
      this.router.navigate(["/dashboard/main"]);
    }*/
  }
}
