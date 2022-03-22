import { DepartmentProfileComponent } from "./department-profile/department-profile.component";
import { EditDepartmentComponent } from "./edit-department/edit-department.component";
import { AddDepartmentComponent } from "./add-department/add-department.component";
import { AllDepartmentsComponent } from "./alldepartments/all-departments.component";
import { Page404Component } from "./../../authentication/page404/page404.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "all-departments",
    component: AllDepartmentsComponent,
  },
  {
    path: "add-department",
    component: AllDepartmentsComponent,
  },
  {
    path: "edit-department/:id",
    component: AllDepartmentsComponent,
  },
  {
    path: "department-profile",
    component: DepartmentProfileComponent,
  },
  { path: "**", component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepartmentsRoutingModule {}
