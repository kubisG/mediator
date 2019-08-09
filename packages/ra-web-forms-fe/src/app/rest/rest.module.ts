import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RestUsersService } from "./rest-users.service";
import { RestFormsService } from "./rest-forms.service";
import { RestFormsSpecService } from "./rest-forms-spec.service";
import { RestPreferencesService } from "./rest-preferences.service";

@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [
        RestUsersService,
        RestFormsService,
        RestFormsSpecService,
        RestPreferencesService,
    ],
})
export class RestModule {

}
