import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { DepartmentProfileComponent } from "./department-profile.component";

describe("DepartmentProfileComponent", () => {
  let component: DepartmentProfileComponent;
  let fixture: ComponentFixture<DepartmentProfileComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DepartmentProfileComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
