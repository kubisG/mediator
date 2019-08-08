import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, Inject } from "@angular/core";
import { MenuItem } from "./menu-item.interface";
import { UserInfo } from "./user-info.interface";
import { Observable } from "rxjs/internal/Observable";
import { ButtonItem } from "./button-item.interface";
import { DOCUMENT } from "@angular/common";
@Component({
    selector: "ra-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.less"],
})
export class HeaderComponent {

    public zoom = 1;

    constructor(
        @Inject(DOCUMENT) private document: any
    ) {
        for (let i = 0.8; i < 1.2; i = i + 0.1) {
            if (this.document.body.classList.contains("zoom-" + i.toString().replace(".", ""))) {
                this.zoom = i;
                break;
            }
        }
    }

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
    @Input() defaultLayout: string;
    @Input() fontResize: boolean;

    @Input() expansionMenuLeft;
    @Input() expansionMenuRight;

    @Output() onMenuItemClick: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();

    public menuItemClick(item: MenuItem) {
        //    this.activeModule = item;
        this.onMenuItemClick.emit(item);
    }

    public setZoom() {
        this.document.body.classList.remove("zoom-09", "zoom-1", "zoom-11", "zoom-12", "zoom-08");
        this.zoom = this.zoom + 0.1;
        if (this.zoom > 1.25) { this.zoom = 0.8; }
        this.document.body.classList.add("zoom-" + (this.zoom.toFixed(1).toString().replace(".", "")));
        setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
        }, 0);

    }

}
