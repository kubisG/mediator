import { Component, OnInit, Inject, OnDestroy, Input, Output, EventEmitter } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";


@Component({
    selector: "ra-data-grid",
    templateUrl: "./data-grid.component.html",
    styleUrls: ["./data-grid.component.less"]
})
export class DataGridComponent {
    @Input() columns;
    @Input() data;
    @Input() updates;
    @Input() key;
    @Input() removes;
    @Output() rowClick: EventEmitter<any> = new EventEmitter();


    onRowClick(evt) {
        this.rowClick.next(evt);
    }

}
