import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatDialogModule } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { MatSortModule } from "@angular/material/sort";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MaterialFileInputModule } from "ngx-material-file-input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DepartmentsRoutingModule } from "./departments-routing.module";
import { AddDepartmentComponent } from "./add-department/add-department.component";
import { AllDepartmentsComponent } from "./alldepartments/all-departments.component";
import { EditDepartmentComponent } from "./edit-department/edit-department.component";
import { DepartmentProfileComponent } from "./department-profile/department-profile.component";
import { DeleteComponent } from "./alldepartments/dialog/delete/delete.component";
import { FormDialogComponent } from "./alldepartments/dialog/form-dialog/form-dialog.component";
import { DepartmentService } from "./alldepartments/department.service";

@NgModule({
  declarations: [
    AddDepartmentComponent,
    AllDepartmentsComponent,
    EditDepartmentComponent,
    DepartmentProfileComponent,
    DeleteComponent,
    FormDialogComponent,
  ],
  imports: [
    CommonModule,
    DepartmentsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSortModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatSelectModule,
    MatRadioModule,
    MatMenuModule,
    MatCheckboxModule,
    MaterialFileInputModule,
    MatProgressSpinnerModule,
  ],
  providers: [DepartmentService],
})
export class DepartmentsModule {}
