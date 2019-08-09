import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RestUsersService } from "./forms-rest-users.service";
import { RestFormsService } from "./forms-rest.service";
import { RestFormsSpecService } from "./forms-rest-spec.service";
import { RestFormsExternalService } from "./forms-rest-external.service";

@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [
        RestUsersService,
        RestFormsService,
        RestFormsSpecService,
        RestFormsExternalService,
    ],
})
export class FormsRestModule {

}
