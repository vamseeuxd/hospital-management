import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-add-department",
  templateUrl: "./add-department.component.html",
  styleUrls: ["./add-department.component.sass"],
})
export class AddDepartmentComponent {
  departmentForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.departmentForm = this.fb.group({
      first: ["", [Validators.required, Validators.pattern("[a-zA-Z]+")]],
      last: [""],
      gender: ["", [Validators.required]],
      mobile: [""],
      dob: ["", [Validators.required]],
      age: [""],
      email: [
        "",
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      maritalStatus: [""],
      address: [""],
      bGroup: [""],
      bPresure: [""],
      sugger: [""],
      injury: [""],
      uploadImg: [""],
    });
  }
  onSubmit() {
    console.log("Form Value", this.departmentForm.value);
  }
}
