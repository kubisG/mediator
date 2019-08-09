import { Input, Component } from "@angular/core";
import { MessageType } from "@ra/web-shared-fe";
import { environment } from "../../../environments/environment";

@Component({
    selector: "ra-tree-row",
    templateUrl: "./tree-row.component.html",
    styleUrls: ["./tree-row.component.less"],
})
export class TreeRowComponent {

    @Input() lists;

    @Input() set data(ord) {
        this._data = ord;
        this.message = this.setMessage();
    }

    get data() {
        return this._data;
    }


    public message = "";
    private _data;

    constructor(
    ) {
    }

    public setMessage() {
        switch (this.data.msgType) {
            case MessageType.Order: {
                return this.data.msgType + " (" + this.data.ClOrdID + ") " + this.data.Side + " " + this.data.OrderQty
                    + "@" + (this.data.Price ? (Number(this.data.Price)).toFixed(environment.precision) :
                        Number(0).toFixed(environment.precision))
                    + " " + this.data.ExDestination + " " + this.data.Symbol + " "
                    + (this.data.Text ? (";" + this.data.Text) : "");
            }
            case MessageType.Replace: {
                return this.data.msgType +
                    " (" + this.data.OrigClOrdID + " --> " + this.data.ClOrdID + ") " + this.data.Side + " " + this.data.OrderQty
                    + "@" + (this.data.Price ? (Number(this.data.Price)).toFixed(environment.precision) :
                        Number(0).toFixed(environment.precision))
                    + " " + this.data.ExDestination + " " + this.data.Symbol + " "
                    + (this.data.Text ? (";" + this.data.Text) : "");
            }
            case MessageType.Cancel: {
                return this.data.msgType + `(${this.data.OrigClOrdID})` + (this.data.Text ? (";" + this.data.Text) : "");
            }
            case MessageType.OrderCancelReject: {
                return this.data.msgType + `(${this.data.OrigClOrdID})` + (this.data.Text ? (";" + this.data.Text) : "");
            }
            case MessageType.Execution: {
                return this.data.msgType + ` ${this.data.ExecType} ${this.data.ClOrdID} ${this.data.Side}` +
                    ` ${this.data.LastQty ? this.data.LastQty : "0"}@`
                    + `${this.data.LastPx ? (Number(this.data.LastPx)).toFixed(environment.precision) :
                        Number(0).toFixed(environment.precision)} `
                    + ` (${this.data.CumQty ? this.data.CumQty : "0"}@`
                    + `${this.data.AvgPx ? (Number(this.data.AvgPx)).toFixed(environment.precision) :
                        Number(0).toFixed(environment.precision)}) `
                    + ` ${this.data.LeavesQty ? this.data.LeavesQty : "0"} remaining`
                    + (this.data.Text ? (";" + this.data.Text) : "");
            }
        }
    }
}
