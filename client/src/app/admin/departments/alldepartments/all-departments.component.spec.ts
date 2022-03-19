import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { AllDepartmentsComponent } from "./all-departments.component";

describe("AlldepartmentsComponent", () => {
  let component: AllDepartmentsComponent;
  let fixture: ComponentFixture<AllDepartmentsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AllDepartmentsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AllDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
