import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";
import { MenuItem } from "./menu-item.interface";
import { UserInfo } from "./user-info.interface";
import { Observable } from "rxjs/internal/Observable";
import { ButtonItem } from "./button-item.interface";
@Component({
    selector: "ra-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {

    activeModule: MenuItem;

    @Input() logoUrl: string;
    @Input() logoImg: string;
    @Input() appVersion: string;
    @Input() appVersionLong: string;
    @Input() appLabel: string;
    @Input() alertMessage: string;
    @Input() user: UserInfo;
    @Input() buttonItems: Observable<ButtonItem[]>;
    @Input() menuItems: Observable<MenuItem[]>;
    @Input() leftMenuLabel: string;
    @Input() leftMenuItems: Observable<MenuItem[]>;
    @Input() subTitle: string;

    @Output() onMenuItemClick: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();

    public menuItemClick(item: MenuItem) {
        //    this.activeModule = item;
        this.onMenuItemClick.emit(item);
    }

}
