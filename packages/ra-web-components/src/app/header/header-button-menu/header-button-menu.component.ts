import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MenuItem } from "../menu-item.interface";
import { Observable } from "rxjs/internal/Observable";

@Component({
    selector: "ra-header-button-menu",
    templateUrl: "./header-button-menu.component.html",
    styleUrls: ["./header-button-menu.component.less"],
})
export class HeaderButtonMenuComponent {

    @Input() menuIcon: string;
    @Input() menuItems: Observable<MenuItem[]>;

    @Output() itemClick: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();

    public menuItemClick(item: MenuItem) {
        this.itemClick.emit(item);
    }

}
