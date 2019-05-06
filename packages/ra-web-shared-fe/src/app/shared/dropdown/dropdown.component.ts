import { Component, Input, Output, EventEmitter } from "@angular/core";
import { DropDownItem } from "./dropdown-item";
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: "ra-dropdown",
    templateUrl: "./dropdown.component.html",
    styleUrls: ["./dropdown.component.less"],
})
export class DropDownComponent {

    @Input() items: DropDownItem[];
    @Output() itemClick: EventEmitter<DropDownItem> = new EventEmitter<DropDownItem>();

    constructor(
        private translate: TranslateService,
    ) {

    }

}
