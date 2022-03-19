import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { DepartmentService } from "../../department.service";
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import { Department } from "../../department.model";

@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.sass"],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  departmentForm: FormGroup;
  department: Department;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public departmentService: DepartmentService,
    private fb: FormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.department.name;
      this.department = data.department;
    } else {
      this.dialogTitle = "New Department";
      this.department = new Department({});
    }
    this.departmentForm = this.createContactForm();
  }
  formControl = new FormControl("", [
    Validators.required,
    // Validators.email,
  ]);
  getErrorMessage() {
    return this.formControl.hasError("required")
      ? "Required field"
      : this.formControl.hasError("email")
      ? "Not a valid email"
      : "";
  }
  createContactForm(): FormGroup {
    return this.fb.group({
      id: [this.department.id],
      img: [this.department.img],
      name: [this.department.name],
      gender: [this.department.gender],
      date: [this.department.date],
      bGroup: [this.department.bGroup],
      mobile: [this.department.mobile],
      address: [this.department.address],
      treatment: [this.department.treatment],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.departmentService.addDepartment(this.departmentForm.getRawValue());
  }
}
