import { Component, Input } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { ButtonItem } from "../button-item.interface";

@Component({
    selector: "ra-header-buttons",
    templateUrl: "./header-buttons.component.html",
    styleUrls: ["./header-buttons.component.less"],
})
export class HeaderButtonsComponent {

    @Input() buttonItems: Observable<ButtonItem[]>;

}
