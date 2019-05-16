import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MenuItem } from './menu-item.interface';
import { UserInfo } from './user-info.interface';
import { ImgButton } from './img-button.interface';
import { Observable } from 'rxjs/internal/Observable';
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
    @Input() messageButton: ImgButton;
    @Input() cloudButton: ImgButton;
    @Input() wifiButton: ImgButton;
    @Input() menuItems: Observable<MenuItem[]>;

    @Output() onMenuItemClick: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();

    public menuItemClick(item: MenuItem) {
        this.activeModule = item;
        this.onMenuItemClick.emit(item);
    }

}
