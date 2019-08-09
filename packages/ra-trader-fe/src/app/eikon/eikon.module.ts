import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { EikonService } from "./eikon.service";
import { WsService } from "./ws.service";

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
    ],
    declarations: [],
    exports: [],
    providers: [
        EikonService,
        WsService,
    ]
})
export class EikonModule { }
