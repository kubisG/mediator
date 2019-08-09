import { Component, EventEmitter, Input } from "@angular/core";
import { DockableControls } from "@ra/web-components";

@Component({
    selector: "ra-hub-forms-header",
    templateUrl: "./hub-forms-header.component.html",
    styleUrls: ["./hub-forms-header.component.less"]
})
export class HubFormsHeaderComponent implements DockableControls<any, EventEmitter<any>> {

    data: any = {};
    result: EventEmitter<any> = new EventEmitter();

    public isActive = true;

    constructor() {

    }

    public bindWindow() {
        this.isActive = !this.isActive;
        this.result.emit({ isActive: this.isActive });
    }
}

