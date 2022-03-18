import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-dialogform",
  templateUrl: "./otp-dialog.component.html",
  styleUrls: ["./otp-dialog.component.sass"],
})
export class OtpDialogComponent {
  @Input() mobileNumber = "9962266742";
  otpProvided = "";
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() verify: EventEmitter<{ mobile: string; mobileOtp: string; }> = new EventEmitter<{ mobile: string; mobileOtp: string }>();
  @Output() resendOtp: EventEmitter<string> = new EventEmitter<string>();

  onOtpChange($event: string) {
    this.otpProvided = $event;
  }
}
