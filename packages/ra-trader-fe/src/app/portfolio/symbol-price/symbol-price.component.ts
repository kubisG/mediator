import { Component, OnInit, Input, LOCALE_ID, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { formatDate } from "@angular/common";
import { environment } from "../../../environments/environment";
import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: "ra-symbol-price",
    templateUrl: "./symbol-price.component.html",
    styleUrls: ["./symbol-price.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SymbolPriceComponent implements ICellRendererAngularComp {

    @Input() cellData;
    @Input() set symbolsData(data) {
        this._symbolsData = data;
        this.initData();
    }

    get symbolsData() {
        return this._symbolsData;
    }

    public _symbolsData = {};
    public inicialized = false;
    public changed = false;
    public txtPrice = "";
    public toolTip = "Not available";
    private myPrice = 0;

    constructor(
        @Inject(LOCALE_ID) private locale: string,
        private changeDetectornRef: ChangeDetectorRef,
    ) { }


    agInit(params: any): void {
        this.cellData = params;
        this.inicialized = true;
    }

    refresh(params): boolean {
        this.cellData = params;
        return true;
    }

    private initData() {
        this.myPrice = this.cellData.value;
        this.txtPrice = "" + this.myPrice ? Number(this.myPrice).toFixed(environment.precision) : "";

        if ((this.symbolsData[this.cellData.data.Symbol]) && (this.symbolsData[this.cellData.data.Symbol].lastPx)) {
            this.myPrice = this.cellData.value ?
                this.cellData.value : this.symbolsData[this.cellData.data.Symbol].lastPx;
            this.txtPrice = "" + Number(this.myPrice).toFixed(environment.precision);
            this.cellData.data.CurrentPrice = this.myPrice;
            this.changed = true;
            this.toolTip = "Date: "
                + formatDate(this.symbolsData[this.cellData.data.Symbol].priceDate, "yyyy-MM-dd", this.locale) + "\n";
            this.toolTip = this.toolTip + "Last Price: " +
                Number(this.symbolsData[this.cellData.data.Symbol].lastPx).toFixed(environment.precision) + "\n";
            this.toolTip = this.toolTip + "Start Price: " +
                Number(this.symbolsData[this.cellData.data.Symbol].startPx).toFixed(environment.precision);
        }
        this.inicialized = true;
        this.changeDetectornRef.markForCheck();
    }

}
