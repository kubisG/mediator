import { Component, EventEmitter } from "@angular/core";
import { DockableControls } from "@ra/web-components";

@Component({
    selector: "ra-hub-forms-tab",
    templateUrl: "./hub-forms-tab.component.html",
    styleUrls: ["./hub-forms-tab.component.less"]
})
export class HubFormsTabComponent implements DockableControls<any, EventEmitter<any>> {

    data: any = {};
    result: EventEmitter<any> = new EventEmitter();

    constructor() {

    }

    public sendClick(action) {
        this.result.emit({ action: action });
    }

}

