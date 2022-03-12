import { NgModule } from "@angular/core";
import { OtpDialogComponent } from "./otp-dialog/otp-dialog.component";
import { SharedModule } from "../shared/shared.module";
import { NgOtpInputModule } from "ng-otp-input";

@NgModule({
  declarations: [OtpDialogComponent],
  imports: [SharedModule, NgOtpInputModule],
  exports: [OtpDialogComponent],
})
export class SharedComponentsModule {}
