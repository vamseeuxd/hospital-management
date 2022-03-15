import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExtraPagesRoutingModule } from "./extra-pages-routing.module";
import { ProfileComponent } from "./profile/profile.component";
import { PricingComponent } from "./pricing/pricing.component";
import { InvoiceComponent } from "./invoice/invoice.component";
import { FaqsComponent } from "./faqs/faqs.component";
import { BlankComponent } from "./blank/blank.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTabsModule } from "@angular/material/tabs";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MaterialFileInputModule} from "ngx-material-file-input";
import {SharedComponentsModule} from "../shared-components/shared-components.module";
import {MatDialogModule} from "@angular/material/dialog";

@NgModule({
  declarations: [
    ProfileComponent,
    PricingComponent,
    InvoiceComponent,
    FaqsComponent,
    BlankComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    SharedComponentsModule,
    ExtraPagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule,
    MatSelectModule,
    MatDatepickerModule,
    MaterialFileInputModule,
  ],
})
export class ExtraPagesModule {}
