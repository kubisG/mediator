import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "@ra/web-material-fe";
import { HeaderComponent } from "./header.component";
import { AlertMessageComponent } from "./alert-message/alert-message.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        MaterialModule,
    ],
    declarations: [
        HeaderComponent,
        AlertMessageComponent,
    ],
    exports: [
        HeaderComponent,
    ]
})
export class HeaderModule {

}
