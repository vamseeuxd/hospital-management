import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {DepartmentService, IDepartment} from "./department.service";
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {map} from "rxjs/operators";
import {UnsubscribeOnDestroyAdapter} from "src/app/shared/UnsubscribeOnDestroyAdapter";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {NgForm} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: "app-alldepartments",
  templateUrl: "./all-departments.component.html",
  styleUrls: ["./all-departments.component.scss"],
})
export class AllDepartmentsComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  @ViewChild('addDepartmentModalTemplateRef') addDepartmentModalTemplateRef;
  currentPage$ = this.activateRoute.url.pipe(map(d => d[0].path));
  editId: string;
  editName: string;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public activateRoute: ActivatedRoute,
    public departmentService: DepartmentService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private modalService: NgbModal
  ) {
    super();
  }

  ngOnInit() {
    this.currentPage$.subscribe(value => {
      setTimeout(async () => {
        switch (value) {
          case 'add-department':
            this.editId = null;
            this.editName = null;
            this.openAddDepartmentModal(this.addDepartmentModalTemplateRef);
            break;
          case 'edit-department':
            if (this.departmentService.isLoadedAction.value) {
              await this.checkForEdit();
            } else {
              const sub = this.departmentService.isLoaded$.subscribe(async () => {
                sub.unsubscribe();
                await this.checkForEdit();
              });
            }
            break;
        }
      }, 500);
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // close all open modals
        this.modalService.dismissAll();
      }
    });
  }

  async checkForEdit() {
    this.editId = this.activateRoute.snapshot.paramMap.get('id');
    if (this.departmentService.departmentsList.map(d => d.id).includes(this.editId)) {
      const ind = this.departmentService.departmentsList.map(d => d.id).indexOf(this.editId);
      this.editName = this.departmentService.departmentsList.map(d => d.name)[ind];
      this.openAddDepartmentModal(this.addDepartmentModalTemplateRef);
    } else {
      alert('Invalid Department Id');
      await this.router.navigate(['admin/departments/all-departments']);
    }
  }

  openAddDepartmentModal(addDepartmentModalTemplateRef: TemplateRef<any>) {
    const modalRef = this.modalService.open(addDepartmentModalTemplateRef, {centered: true, backdrop: false});
    const subscriptionRef = modalRef.closed.subscribe(async value => {
      subscriptionRef.unsubscribe();
      await this.router.navigate(['admin/departments/all-departments']);
    });
  }

  async addNewDepartment(addDepartmentForm: NgForm, modal: NgbModalRef, closeModal = true) {
    await this.spinner.show('wait');
    try {
      if (this.editId) {
        await this.departmentService.updateDepartment({active: true, name: addDepartmentForm.value.name}, this.editId);
        this.snackBar.open('Department Updated Successfully', 'OK', {duration: 4000});
      } else {
        await this.departmentService.addDepartment({active: true, name: addDepartmentForm.value.name});
        this.snackBar.open('Department Added Successfully', 'OK', {duration: 4000});
      }
      await this.spinner.hide('wait');
      addDepartmentForm.resetForm({});
      if (closeModal) {
        modal.close();
      }
    } catch (e) {
      await this.spinner.hide('wait');
      this.snackBar.open(e, 'OK', {duration: 4000});
    }
  }

  async deleteDepartment(department: IDepartment) {
    const isConfirm = confirm('Are you sure? Do you want to delete?');
    if (isConfirm) {
      await this.spinner.show('wait');
      try {
        await this.departmentService.deleteDepartment(department);
        await this.spinner.hide('wait');
        this.snackBar.open('Department Deleted Successfully', 'OK', {duration: 4000});
      } catch (e) {
        await this.spinner.hide('wait');
        this.snackBar.open(e, 'OK', {duration: 4000});
      }
    }
  }

  editDepartment(department: IDepartment) {

  }
}
