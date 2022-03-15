import {Component, OnDestroy, OnInit} from "@angular/core";
import {Auth} from "@angular/fire/auth";
import {IUser, UsersService} from "../../data-base/users/users.service";
import {AuthService} from "../../core/service/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";
import {MatDialog} from "@angular/material/dialog";
import {WebCamComponent} from "../../shared-components/web-cam/web-cam.component";
import {WebcamImage} from "ngx-webcam";
import {getDownloadURL, getStorage, ref, uploadBytes} from "@angular/fire/storage";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  hide3 = true;
  agree3 = false;
  currentUser: IUser;
  currentUserSubscription: Subscription;
  mainImage = '';
  webcamImage: WebcamImage = null;

  constructor(
    private fb: FormBuilder,
    public auth: Auth,
    public dialogModel: MatDialog,
    private spinner: NgxSpinnerService,
    public authService: AuthService,
    public usersService: UsersService,
  ) {
    this.spinner.show("wait");
    // gs://tat-clinic.appspot.com/male.png
  }

  async onSubmit() {
    await this.spinner.show("wait");
    try {
      const dob = `${this.profileForm.value.dob.getMonth() + 1}-${this.profileForm.value.dob.getDate()}-${this.profileForm.value.dob.getFullYear()}`;
      await this.usersService.updateUser({...this.profileForm.value, dob}, this.currentUser.id);
      await this.spinner.hide('wait');
    } catch (e) {
      await this.spinner.hide('wait');
    }
  }

  ngOnInit() {
    this.currentUserSubscription = this.authService.currentUser.subscribe(value1 => {
      const sub = this.usersService.getUsersByMobile(value1.username, false).subscribe(async value => {
        sub.unsubscribe();
        this.profileForm = this.fb.group({
          firstName: [value[0].firstName, [Validators.required]],
          lastName: [value[0].lastName],
          gender: [value[0].gender, [Validators.required]],
          mobile: [value[0].mobile, [Validators.required]],
          designation: [value[0].designation],
          department: [value[0].department],
          address: [value[0].address],
          email: [value[0].email, [Validators.required, Validators.email, Validators.minLength(5)]],
          dob: [value[0].dob ? new Date(value[0].dob) : '', [Validators.required]],
          education: [value[0].education],
          picture: [value[0].picture],
        });
        await this.getImage(value[0].picture);
        this.currentUser = value[0];
      });
    });
    // this.updateProfilePicture();
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  updateProfilePicture() {
    const dialogRef = this.dialogModel.open(WebCamComponent, {width: "640px", disableClose: true});
    dialogRef.componentInstance.title = `${this.currentUser.firstName} ${this.currentUser.lastName} Profile Picture`;
    const sub1 = dialogRef.componentInstance.close.subscribe(() => {
      sub1.unsubscribe();
      sub2.unsubscribe();
      dialogRef.close();
    });
    const sub2 = dialogRef.componentInstance.save.subscribe((image: WebcamImage) => {
      console.log(image.imageData);
      this.webcamImage = image;
      this.uploadImage(image.imageAsDataUrl);
      sub1.unsubscribe();
      sub2.unsubscribe();
      dialogRef.close();
    });
  }

  async getImage(picture: string) {
    const storage = getStorage();
    const pathReference = ref(storage, picture);
    getDownloadURL(pathReference).then(async value => {
      this.mainImage = value;
      await this.spinner.hide("wait");
    });
  }

  async uploadImage(dataUrl: string) {
    const storage = getStorage();
    const storageRef = ref(storage, 'profile/' + this.currentUser.uid);
    const file = new File([this.convertDataUrlToBlob(dataUrl)], this.currentUser.uid, {type: `image/${'png'}`});
    await this.spinner.show('wait');
    uploadBytes(storageRef, file).then(async (snapshot) => {
      console.log('Uploaded a blob or file!', snapshot);
      this.profileForm.patchValue({picture: snapshot.metadata.fullPath});
      await this.spinner.hide("wait");
    });
    // console.log(file);
  }

  convertDataUrlToBlob(dataUrl): Blob {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
  }
}
