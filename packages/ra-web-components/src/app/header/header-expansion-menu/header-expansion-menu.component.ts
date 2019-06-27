import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { MenuItem } from "../menu-item.interface";

@Component({
    selector: "ra-header-expansion-menu",
    templateUrl: "./header-expansion-menu.component.html",
    styleUrls: ["./header-expansion-menu.component.less"],
})
export class HeaderExpansionMenuComponent {

    @Input() menuIcon: string;
    @Input() menuItems: Observable<MenuItem[]>;

    @Output() itemClick: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();

    public menuItemClick(item: MenuItem) {
        this.itemClick.emit(item);
    }

}
