import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "@ra/web-material-fe";
import { HeaderComponent } from "./header.component";
import { AlertMessageComponent } from "./alert-message/alert-message.component";
import { HeaderButtonMenuComponent } from "./header-button-menu/header-button-menu.component";
import { HeaderButtonsComponent } from "./header-buttons/header-buttons.component";
import { HeaderExpansionMenuComponent } from "./header-expansion-menu/header-expansion-menu.component";

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
        HeaderButtonMenuComponent,
        HeaderButtonsComponent,
        HeaderExpansionMenuComponent,
    ],
    exports: [
        HeaderComponent,
    ]
})
export class HeaderModule {

}
