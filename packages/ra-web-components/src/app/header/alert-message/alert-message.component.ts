import { Component, Input } from "@angular/core";

@Component({
    selector: "ra-header-alert-message",
    templateUrl: "./alert-message.component.html",
    styleUrls: ["./alert-message.component.less"]
})
export class AlertMessageComponent {

    @Input() message: string;

}
