import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: "ra-row-graph",
    templateUrl: "./row-graph.component.html",
    styleUrls: ["./row-graph.component.less"],
})
export class RowGraphComponent implements ICellRendererAngularComp {
    public params: any;

    public currentValue = 0;

    @Input() set data(data) {
        if (data.data && data.data.OrderQty && data.data.OrderQty > 0) {
            this.inicialized = false;
            this.currentValue = (Number(data.data.CumQty ? data.data.CumQty : 0) / Number(data.data.OrderQty) * 100);
            this.inicialized = true;
        }
    }
    @Input() inicialized;

    agInit(params: any): void {
        this.params = params;
        this.data = params;
        this.inicialized = true;
    }

    refresh(params): boolean {
        this.params = params;
        this.data = params;
        return true;
    }

}
