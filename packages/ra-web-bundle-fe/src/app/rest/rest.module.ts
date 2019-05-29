import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RestUsersService } from "./rest-users.service";

@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [
        RestUsersService,
    ],
})
export class RestModule {

}
