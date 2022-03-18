import {NgModule} from "@angular/core";
import {OtpDialogComponent} from "./otp-dialog/otp-dialog.component";
import {SharedModule} from "../shared/shared.module";
import {NgOtpInputModule} from "ng-otp-input";
import {WebCamComponent} from './web-cam/web-cam.component';
import {WebcamModule} from 'ngx-webcam';
import {MatCardModule} from "@angular/material/card";
import {NgxPhotoEditorModule} from "ngx-photo-editor";
import { PhotoEditorComponent } from './photo-editor/photo-editor.component';

@NgModule({
  declarations: [OtpDialogComponent, WebCamComponent, PhotoEditorComponent],
  imports: [SharedModule, NgOtpInputModule, WebcamModule, MatCardModule, NgxPhotoEditorModule],
  exports: [OtpDialogComponent, WebCamComponent, PhotoEditorComponent],
})
export class SharedComponentsModule {
}
