import { Component, EventEmitter, ChangeDetectionStrategy, ElementRef } from "@angular/core";
import { DockableControls, DockableService } from "@ra/web-components";

@Component({
    selector: "ra-monitor-tab",
    templateUrl: "./monitor-tab.component.html",
    styleUrls: ["./monitor-tab.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitorTabComponent implements DockableControls<any, EventEmitter<any>> {

    data: any = { key: "" };
    result: EventEmitter<any> = new EventEmitter();

    constructor(
        private dockableService: DockableService,
        private el: ElementRef,
    ) { }

    emitClick() {
        this.dockableService.stackBroadcast({ aaaa: "bbbb" }, this.el);
        this.result.emit({ test: "test" });
    }

}
