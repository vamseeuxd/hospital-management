import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { OtpDialogComponent } from "./otp-dialog.component";
describe("DialogformComponent", () => {
  let component: OtpDialogComponent;
  let fixture: ComponentFixture<OtpDialogComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OtpDialogComponent],
      }).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(OtpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
