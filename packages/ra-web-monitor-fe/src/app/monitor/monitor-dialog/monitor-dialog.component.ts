import { Component, Input } from "@angular/core";

@Component({
    selector: "ra-monitor-dialog",
    templateUrl: "./monitor-dialog.component.html",
    styleUrls: ["./monitor-dialog.component.less"]
})
export class MonitorDialogComponent {
    @Input() err: string;
}
