import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataExchangeService } from "./data-exchange.service";

@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [
        DataExchangeService,
    ],
    declarations: [
    ],
    exports: [
    ]
})
export class DataExchangeModule {

}
