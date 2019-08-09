import {
    Component, OnInit, Input, Output, EventEmitter, LOCALE_ID, Inject,

} from "@angular/core";

import { HitlistSettingsService } from "../../core/hitlist-settings/hitlist-settings.service";
import { ToasterService } from "angular2-toaster";
import { ExecTransType } from "@ra/web-shared-fe";
import { ExecType } from "@ra/web-shared-fe";
import { environment } from "../../../environments/environment-trader.prod";
import { DataExchangeService } from "@ra/web-components";
import { OrderInitService } from "../../rest/order-init.service";
import { hitlistFormatValue } from "@ra/web-shared-fe";

@Component({
    selector: "ra-order-fills",
    templateUrl: "./order-fills.component.html",
    styleUrls: ["./order-fills.component.less"]
})
export class OrderFillsComponent implements OnInit {

    private dataGrid;

    @Output() reloadData: EventEmitter<any> = new EventEmitter<any>();

    @Input() set execution(execution) {
        if (execution && ((execution.ExecType) &&
            ((execution.ExecType === ExecType.Fill) || (execution.ExecType === ExecType.PartialFill)
                || (execution.ExecType === ExecType.Trade)))) {
                    this.dataGrid.insertRow(execution);
        }
    }

    @Input() set initData(data) {
        if (!data) {
            return;
        }
        data.map((val) => {
            val["TransactTime"] = new Date(val["TransactTime"]);
        });
        this.dataGrid.setData(data);
    }

    public lists;
    public inicialized = false;

    public env = environment;
    public hitlistFormat = hitlistFormatValue;
    public columns: any[];

    constructor(
        @Inject(LOCALE_ID) private locale: string,
        private orderInitService: OrderInitService,
        private hitlistSettingsService: HitlistSettingsService,
        public dataExchangeService: DataExchangeService,
    ) {

        const that = this;
        this.columns = [
            {
                caption: "Latest", dataField: "TransactTime", sort: "desc", valueFormatter: function (data) {
                    return that.hitlistFormat(data,
                        { locale: that.locale, dataField: "TransactTime", dataType: "date", format: "HH:mm:ss.S" }
                    );
                }, cellStyle: function (item) {
                    if (!item.data) {
                        return item;
                    }

                    if ((item.data["ExecTransType"]) && (item.data["ExecTransType"] === ExecTransType.Cancel)) {
                        return { backgroundColor: "#f5475b", color: "black" };
                    }
                }
            },
            {
                caption: "Side", dataField: "Side", valueFormatter: function (data) {
                    return that.hitlistFormat(data,
                        {
                            dataField: "Side", dataType: "lookup",
                            lookup: { dataSource: that.lists["Side"], valueExpr: "value", displayExpr: "name" }
                        }
                    );
                }
            },
            { caption: "Symbol", dataField: "Symbol" },
            { caption: "Counterparty", dataField: "SenderCompID" },
            { caption: "LeavesQty", dataField: "LeavesQty", type: ["numericColumn"]  },
            { caption: "AvgPx", dataField: "AvgPx", type: ["numericColumn"] },
            { caption: "LastQty", dataField: "LeavesQty", type: ["numericColumn"]  },
            { caption: "LastPx", dataField: "LastPx", type: ["numericColumn"] },
        ];
    }

    initAllData() {
        this.reloadData.emit();
    }
    /**
     * Saving last table state
     */
    saveState() {
        this.hitlistSettingsService.saveState("fills", this.dataGrid);
    }

    /**
     * Loading last saved table state
     * @param ev Grid component
     */
    onInitialized(e) {
        this.dataGrid = e.component ? e.component : e;
        this.loadState(e);
    }

    /**
     * Loading last saved table state
     * @param ev Grid component
     */
    loadState(ev) {
        this.hitlistSettingsService.loadState("fills", this.dataGrid);
    }

    ngOnInit() {
        this.orderInitService.getLists().then((data) => {
            this.lists = data;
            this.inicialized = true;
        });
    }

    onRowPrepared(item) {
        if (item.data) {
            if ((item.data["ExecTransType"]) && (item.data["ExecTransType"] === ExecTransType.Cancel)) {
                item.rowElement.style.color = "#f5475b";
            }
            if ((item.data["Canceled"]) && (item.data["Canceled"] === "Y")) {
                item.rowElement.classList.add("canceled");
            }
        }
    }
}

