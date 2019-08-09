import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MonitorRestUsersService } from "./monitor-rest-users.service";

@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [
        MonitorRestUsersService,
    ],
})
export class MonitorRestModule {

}
