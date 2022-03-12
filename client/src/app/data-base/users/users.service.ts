import {Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  orderBy,
  query,
  updateDoc,
  where
} from '@angular/fire/firestore';
import {BehaviorSubject, EMPTY, Observable} from 'rxjs';
import {shareReplay, switchMap} from 'rxjs/operators';
import {getTimeStampForCollection} from "../getTimeStampForCollection";
import {NgxSpinnerService} from "ngx-spinner";
import {Auth} from "@angular/fire/auth";
import {User} from "@firebase/auth";

export interface IUser {
  id?: string;
  uid?: string;
  mobile: string;
  email: string;
  firstName: string;
  lastName: string;
  isDeleted?: boolean;
  updatedOn?: number;
  createdOn?: number;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  private userAction: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  usersList: IUser[] = [];

  constructor(
    private auth: Auth,
    private spinner: NgxSpinnerService,
    private firestore: Firestore
  ) {
    this.auth.onAuthStateChanged(value => {
      console.log(value);
      this.userAction.next(value);
    });
    this.subscribeUsers();
  }

  async subscribeUsers() {
    await this.spinner.show("wait");
    this.getUsers()
      .subscribe((users) => {
        // tslint:disable-next-line:variable-name
        this.usersList = users;
        this.spinner.hide("wait");
      });
  }

  getUsers(): Observable<IUser[]> {
    return this.userAction.asObservable().pipe(
      switchMap(user => {
        if (user == null) {
          return EMPTY;
        }
        const usersRef = collection(this.firestore, 'users');
        const q1 = query(usersRef, orderBy('createdOn'), where('uid', '==', user.uid));
        return (
          collectionData(q1, {idField: 'id'}) as Observable<IUser[]>
        ).pipe(shareReplay());
      })
    );
  }

  getUserById(id: string): Observable<IUser> {
    const userDocRef = doc(this.firestore, `users/${id}`);
    return docData(userDocRef, {idField: 'id'}) as Observable<IUser>;
  }

  getUsersByMobile(mobile: string): Observable<IUser[]> {
    const usersRef = collection(this.firestore, "users");
    const q = query(usersRef, where("mobile", "==", `+91${mobile}`));
    return (collectionData(q, {idField: 'id'}) as Observable<IUser[]>).pipe(shareReplay());
  }

  addUser(user: IUser) {
    const usersRef = collection(this.firestore, 'users');
    return addDoc(usersRef, {...user, uid: this.auth.currentUser.uid, ...getTimeStampForCollection()});
  }

  deleteUser(user: IUser) {
    const userDocRef = doc(this.firestore, `users/${user.id}`);
    return deleteDoc(userDocRef);
  }

  updateUser(user: IUser, id: string) {
    const userDocRef = doc(this.firestore, `users/${id}`);
    return updateDoc(userDocRef, {
      ...user,
      ...getTimeStampForCollection(false)
    });
  }

}
