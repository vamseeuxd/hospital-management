import {NgModule} from "@angular/core";
import {OtpDialogComponent} from "./otp-dialog/otp-dialog.component";
import {SharedModule} from "../shared/shared.module";
import {NgOtpInputModule} from "ng-otp-input";
import {WebCamComponent} from './web-cam/web-cam.component';
import {WebcamModule} from 'ngx-webcam';
import {MatCardModule} from "@angular/material/card";

@NgModule({
  declarations: [OtpDialogComponent, WebCamComponent],
  imports: [SharedModule, NgOtpInputModule, WebcamModule, MatCardModule],
  exports: [OtpDialogComponent, WebCamComponent],
})
export class SharedComponentsModule {
}
