import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input } from "@angular/core";

@Component({
    selector: "ra-date-range",
    templateUrl: "./date-range.component.html",
    styleUrls: ["./date-range.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateRangeComponent implements OnInit {
    @Input() set dataLoaded(loaded) {
        this._dataLoaded = loaded;
        if (!loaded) {
            this.dateTimeRange = null;
        }
    }
    get dataLoaded() {
        return this._dataLoaded;
    }

    @Input() loadedRange = false;
    @Output() dateChange = new EventEmitter();

    private _dataLoaded = false;
    public dateTimeRange: Date[];

    constructor() {
    }

    public ngOnInit() {
    }

    /**
     * Closing calendar by Set or Cancel button
     * @param event Click on Set or Cancel
     */
    public onClose(event) {
        if ((this.dateTimeRange) && (this.dateTimeRange.length = 2)) {
            this.dateChange.emit({
                dateTimeRange: this.dateTimeRange
            });
        } else {
            this.dateTimeRange = null;
            this.dateChange.emit({
                dateTimeRange: null
            });
        }
    }

    /**
     * When calendar is opened, we have to clean input, because there are no clear button
     * @param event Click on calendar
     */
    public onOpen(event) {
        this.dateTimeRange = null;
    }

    public clearDate() {
        this.dateTimeRange = null;
        this.dateChange.emit({
            dateTimeRange: null
        });
    }
}
