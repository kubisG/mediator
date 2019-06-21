import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RestLayoutService } from "./rest-layout.service";

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        RestLayoutService,
    ],
})
export class RestModule { }
