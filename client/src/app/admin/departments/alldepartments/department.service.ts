import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {Auth} from "@angular/fire/auth";
import {NgxSpinnerService} from "ngx-spinner";
import {addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, orderBy, query, updateDoc} from "@angular/fire/firestore";
import {shareReplay} from "rxjs/operators";
import {getTimeStampForCollection} from "../../../data-base/getTimeStampForCollection";

export interface IDepartment {
  id?: string;
  name: string;
  isDeleted?: boolean;
  updatedOn?: number;
  active: boolean;
  createdOn?: number;
}

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  departmentsList: IDepartment[] = [];
  isLoadedAction: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoaded$ = this.isLoadedAction.asObservable();

  constructor(
    private auth: Auth,
    private spinner: NgxSpinnerService,
    private firestore: Firestore
  ) {
    this.subscribeDepartments().then();
  }

  async subscribeDepartments() {
    this.getDepartments()
      .subscribe((departments) => {
        // tslint:disable-next-line:variable-name
        this.departmentsList = departments;
        this.isLoadedAction.next(true);
      });
  }

  getDepartments(): Observable<IDepartment[]> {
    const departmentsRef = collection(this.firestore, 'departments');
    const q1 = query(departmentsRef, orderBy('createdOn'));
    return (
      collectionData(q1, {idField: 'id'}) as Observable<IDepartment[]>
    ).pipe(shareReplay());
  }

  getDepartmentById(id: string): Observable<IDepartment> {
    const departmentDocRef = doc(this.firestore, `departments/${id}`);
    return docData(departmentDocRef, {idField: 'id'}) as Observable<IDepartment>;
  }

  addDepartment(department: IDepartment) {
    const departmentsRef = collection(this.firestore, 'departments');
    return addDoc(departmentsRef, {...department, ...getTimeStampForCollection()});
  }

  deleteDepartment(department: IDepartment) {
    const departmentDocRef = doc(this.firestore, `departments/${department.id}`);
    return deleteDoc(departmentDocRef);
  }

  updateDepartment(department: IDepartment, id: string) {
    delete department.id;
    const departmentDocRef = doc(this.firestore, `departments/${id}`);
    return updateDoc(departmentDocRef, {
      ...department,
      ...getTimeStampForCollection(false)
    });
  }
}
