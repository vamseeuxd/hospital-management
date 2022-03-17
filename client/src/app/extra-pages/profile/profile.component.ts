import {Component, OnDestroy, OnInit} from "@angular/core";
import {Auth} from "@angular/fire/auth";
import {IUser, UsersService} from "../../data-base/users/users.service";
import {AuthService} from "../../core/service/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";
import {MatDialog} from "@angular/material/dialog";
import {WebcamImage} from "ngx-webcam";
import {getDownloadURL, getStorage, ref, uploadBytes} from "@angular/fire/storage";
import {PhotoEditorComponent} from "../../shared-components/photo-editor/photo-editor.component";

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

  async onSubmit(photoEditor: PhotoEditorComponent) {
    if (photoEditor.base64) {
      await this.uploadImage(photoEditor.base64);
    }
    await this.spinner.show("wait");
    try {
      const dob = `${this.profileForm.value.dob.getMonth() + 1}-${this.profileForm.value.dob.getDate()}-${this.profileForm.value.dob.getFullYear()}`;
      await this.usersService.updateUser({...this.profileForm.value, dob}, this.currentUser.id);
      await this.spinner.hide('wait');
      photoEditor.base64 = null;
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
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  async getImage(picture: string) {
    const storage = getStorage();
    const pathReference = ref(storage, picture);
    // const pathReference = ref(storage, `gs://tat-clinic.appspot.com/${picture}`);
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
    const {metadata: {fullPath}} = await uploadBytes(storageRef, file);
    this.profileForm.patchValue({picture: fullPath});
    await this.spinner.hide("wait");
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
