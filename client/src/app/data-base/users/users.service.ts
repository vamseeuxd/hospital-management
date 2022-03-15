import {Injectable} from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import {BehaviorSubject, EMPTY, Observable} from 'rxjs';
import {shareReplay, switchMap} from 'rxjs/operators';
import {getTimeStampForCollection} from "../getTimeStampForCollection";
import {NgxSpinnerService} from "ngx-spinner";
import {Auth} from "@angular/fire/auth";
import {User} from "@firebase/auth";
import {Role} from "../../core/models/role";

export interface IUser {
  id?: string;
  uid?: string;
  mobile: string;
  gender: 'male' | 'female' | 'other';
  role: Role;
  email: string;
  dob?: string;
  firstName: string;
  lastName: string;
  designation: string;
  department: string;
  address: string;
  education: string;
  picture: string;
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
      this.userAction.next(value);
    });
    this.subscribeUsers();
  }

  async subscribeUsers() {
    this.getUsers()
      .subscribe((users) => {
        // tslint:disable-next-line:variable-name
        this.usersList = users;
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

  getUsersByMobile(mobile: string, addCountryCode = true): Observable<IUser[]> {
    const usersRef = collection(this.firestore, "users");
    const q = query(usersRef, where("mobile", "==", `${addCountryCode ? '+91' : ''}${mobile}`));
    return (collectionData(q, {idField: 'id'}) as Observable<IUser[]>).pipe(shareReplay());
  }

  addUser(user: IUser) {
    const usersRef = collection(this.firestore, 'users');
    return setDoc(
      doc(usersRef, this.auth.currentUser.uid),
      {...user, uid: this.auth.currentUser.uid, ...getTimeStampForCollection()}
    );
    // return addDoc(usersRef, {...user, uid: this.auth.currentUser.uid, ...getTimeStampForCollection()});
  }

  deleteUser(user: IUser) {
    const userDocRef = doc(this.firestore, `users/${user.id}`);
    return deleteDoc(userDocRef);
  }

  updateUser(user: IUser, id: string) {
    delete user.id;
    const userDocRef = doc(this.firestore, `users/${id}`);
    return updateDoc(userDocRef, {
      ...user,
      ...getTimeStampForCollection(false)
    });
  }

}
