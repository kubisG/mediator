import { Component, Input } from '@angular/core';

@Component({
    selector: "ra-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.less"]
})
export class HeaderComponent {

    @Input() logoUrl: string;
    @Input() logoImg: string;
    @Input() appVersion: string;
    @Input() appVersionLong: string;
    @Input() appLabel: string;
    @Input() activeModule: { label: string };
    @Input() alertMessage: string;
    @Input() user: {
        companyName: string,
        firstName: string,
        lastName: string,
    };
    @Input() messageButton: {
        callBack: () => void,
        count: number,
    }
    @Input() cloudButton: {
        callBack: () => void,
        count: number,
    }
    @Input() wifiButton: {
        callBack: () => void,
        on: boolean
    }
    @Input() modules: { route: string, icon: string, label: string }[];

}
