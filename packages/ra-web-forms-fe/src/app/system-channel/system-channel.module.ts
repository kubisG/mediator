import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SystemChannelService } from "./system-channel.service";

@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [
        SystemChannelService,
    ],
})
export class SystemChannelModule {

}
