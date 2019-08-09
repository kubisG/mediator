import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "ra-row-select",
    templateUrl: "./row-select.component.html",
    styleUrls: ["./row-select.component.less"],
})
export class RowSelectComponent {

    public checked = false;
    public _data: any;

    @Input() set data(data) {
        if (data.rowType === "data" && data.data.checked) {
            this.checked = data.data.checked;
            delete data.data.checked;
        }
        this._data = data;
    }
    @Input() set checkAll(check) {
        if (check) {
            this.checked = true;
        }
    }

    @Input() set unCheckAll(uncheck) {
        if (uncheck) {
            this.checked = false;
        }
    }

    @Output() rowCheck: EventEmitter<any> = new EventEmitter();
    @Output() rowUnCheck: EventEmitter<any> = new EventEmitter();

    check() {
        this.checked = !this.checked;
        if (this.checked) {
            this.rowCheck.emit(this._data);
        } else {
            this.rowUnCheck.emit(this._data);
        }
    }

}
