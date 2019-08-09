import { Component, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { HitlistSettingsService } from "../../core/hitlist-settings/hitlist-settings.service";
import { OrderStatusService } from "../../orders/order-status.service";
import { NotifyService } from "../../core/notify/notify.service";
import { BrokerStoreService } from "../order-store/broker-store.service";
import { MessageFactoryService } from "../../orders/message-factory.service";
import { FillService } from "../fill.service";
import { environment } from "../../../environments/environment-trader.prod";
import { hitlistFormatValue } from "@ra/web-shared-fe";

/**
 * TODO : resolve validation Fills vs. DFD
 */
@Component({
    selector: "ra-broker-multi-fill-dialog",
    templateUrl: "./multi-fill-dialog.component.html",
    styleUrls: ["./multi-fill-dialog.component.less"]
})
export class MultiFillDialogComponent {

    public static enabledFillValidation = true;
    public static instance: MultiFillDialogComponent;

    private dataGrid: any;
    private hitlistFormat = hitlistFormatValue;

    public rows: any[] = [];

    public disabled = true;
    public overWrite = false;

    public lists = [];
    public columns: any[];

    public canFill = true;
    public canDFD = true;

    public isGridValid = false;
    public env = environment;

    constructor(
        private hitlistSettingsService: HitlistSettingsService,
        public dialogRef: MatDialogRef<MultiFillDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public datax: any,
        private orderStatusService: OrderStatusService,
        private toasterService: NotifyService,
        public orderStoreService: BrokerStoreService,
        private messageFactoryService: MessageFactoryService,
        private fillService: FillService,
    ) {
        MultiFillDialogComponent.instance = this;
        this.prepareGridData();
        this.datax.lists["CommType"] = this.unique(this.datax.lists["CommType"]);
        this.lists = this.datax.lists;
        this.setActions();
        const that = this;
        this.columns = [
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
            {
                caption: "Symbol", dataField: "Symbol", valueFormatter: function (data) {
                    return that.hitlistFormat(data,
                        {
                            dataField: "Symbol", dataType: "lookup",
                            lookup: { dataSource: that.lists["Symbol"], valueExpr: "value", displayExpr: "name" }
                        }
                    );
                }
            },
            {
                caption: "Order Type", dataField: "OrdType", valueFormatter: function (data) {
                    return that.hitlistFormat(data,
                        {
                            dataField: "OrdType", dataType: "lookup",
                            lookup: { dataSource: that.lists["OrdType"], valueExpr: "value", displayExpr: "name" }
                        }
                    );
                }
            },
            {
                caption: "TIF", dataField: "TimeInForce", valueFormatter: function (data) {
                    return that.hitlistFormat(data,
                        {
                            dataField: "TimeInForce", dataType: "lookup",
                            lookup: { dataSource: that.lists["TimeInForce"], valueExpr: "value", displayExpr: "name" }
                        }
                    );
                }
            },
            { caption: "Order Qty", dataField: "OrderQty", type: ["numericColumn"] },
            { caption: "Filled Qty", dataField: "CumQty", type: ["numericColumn"] },
            { caption: "Leaves Qty", dataField: "LeavesQty", type: ["numericColumn"] },
            {
                caption: "Fill Qty", dataField: "qtyForFill", type: ["numericColumn"],
                cellEditor: "number",
                cellEditorParams: {
                    raType: "numeric",
                    raMin: 0,
                    raPrecision: 0,
                }
                , raValidators: [
                    { valid: that.validateFillQty, message: "Invalid FillQty", level: "ERROR" },
                    { required: true, message: "FillQty must be filled", level: "ERROR" }
                ]
                , allowEditing: that.canFill
            },
            { caption: "Avg Px", dataField: "AvgPx", type: ["numericColumn"] },
            { caption: "Last Px", dataField: "LastPx", type: ["numericColumn"] },
            { caption: "Price", dataField: "Price", type: ["numericColumn"] },
            { caption: "Last Px", dataField: "LastPx", type: ["numericColumn"] },
            {
                caption: "Fill Px", dataField: "pxForFill", type: ["numericColumn"],
                cellEditor: "number",
                cellEditorParams: {
                    raType: "numeric",
                    raMin: 0,
                    raPrecision: that.env.precision,
                }
                , raValidators: [
                    { valid: that.validateFillPx, message: "Invalid FillPx", level: "ERROR" },
                    { valid: that.validateFillPxDistance, message: "> 5% off last fill Px", level: "WARNING" },
                    { valid: that.validateFillPxSide, message: "Wrong side of limit", level: "WARNING" },
                    { required: true, message: "FillPx must be filled", level: "ERROR" }
                ]
                , allowEditing: that.canFill
            },
            { caption: "Last Mkt", dataField: "LastMkt", allowEditing: that.canFill },
            {
                caption: "Last Cap", dataField: "LastCapacity", allowEditing: that.canFill, valueFormatter: function (data) {
                    return that.hitlistFormat(data,
                        {
                            dataField: "LastCapacity", dataType: "lookup",
                            lookup: { dataSource: that.lists["LastCapacity"], valueExpr: "value", displayExpr: "name" }
                        }
                    );
                },
                cellEditor: "select",
                cellEditorParams: {
                    raLookup: { dataSource: that.lists["LastCapacity"], valueExpr: "value", displayExpr: "name" }
                },
            },
            {
                caption: "Last Liq", dataField: "LastLiquidityInd", allowEditing: that.canFill, valueFormatter: function (data) {
                    return that.hitlistFormat(data,
                        {
                            dataField: "LastLiquidityInd", dataType: "lookup",
                            lookup: { dataSource: that.lists["LastLiquidityInd"], valueExpr: "value", displayExpr: "name" }
                        }
                    );
                },
                cellEditor: "select",
                cellEditorParams: {
                    raLookup: { dataSource: that.lists["LastLiquidityInd"], valueExpr: "value", displayExpr: "name" }
                },
            },
            {
                caption: "Comm Type", dataField: "CommType", allowEditing: that.canDFD, valueFormatter: function (data) {
                    return that.hitlistFormat(data,
                        {
                            dataField: "CommType", dataType: "lookup",
                            lookup: { dataSource: that.lists["CommType"], valueExpr: "value", displayExpr: "name" }
                        }
                    );
                },
                cellEditor: "select",
                cellEditorParams: {
                    raLookup: { dataSource: that.lists["CommType"], valueExpr: "value", displayExpr: "name" }
                },
            },
            {
                caption: "Commision", dataField: "Commision", allowEditing: that.canDFD, type: ["numericColumn"],
                cellEditor: "number",
                cellEditorParams: {
                    raType: "numeric",
                    raMin: 0,
                    raPrecision: that.env.precision,
                }
            },
            { caption: "Status", dataField: "OrdStatus" }
        ];
    }

    public static getInstance(): MultiFillDialogComponent {
        return MultiFillDialogComponent.instance;
    }

    private unique(arrArg: any[]) {
        const deserialized = [];
        for (let i = 0; i < arrArg.length; i++) {
            deserialized.push(JSON.stringify(arrArg[i]));
        }
        const filtered = deserialized.filter((elem, pos, arr) => {
            return arr.indexOf(elem) === pos;
        });
        const serialized = [];
        for (let i = 0; i < filtered.length; i++) {
            serialized.push(JSON.parse(filtered[i]));
        }
        return serialized;
    }

    private prepareGridData() {
        for (let i = 0; i < this.datax.rows.length; i++) {
            this.rows.push({
                ...this.datax.rows[i],
                qtyForFill: undefined,
                pxForFill: undefined,
                LastMkt: undefined,
                LastCap: undefined,
                LastLiq: undefined,
                CommType: undefined,
                Commision: undefined,
            });
        }
    }

    private setActions() {
        const instance = this;
        this.rows.forEach((row) => {
            if (!instance.orderStatusService.canFill(row)) {
                instance.canFill = false;
            }
            if (!instance.orderStatusService.canDFD(row)) {
                instance.canDFD = false;
            }
        });
        this.disabled = false;
    }

    private initData() {
        this.dataGrid.setData(this.rows);
    }


    /**
     * Loading last saved table state
     * @param ev Grid component
     */
    onInitialized(e) {
        console.log("init", e);
        this.dataGrid = e.component ? e.component : e;
        this.hitlistSettingsService.loadState("multi-fill", this.dataGrid);
        this.initData();
    }

    public closeDialog() {
        this.dialogRef.close();
    }

    public onEditingStart(event) {

    }

    public rowValidating(event) {
        if (!event.isValid) {
            this.isGridValid = false;
        }
    }

    public sendFills() {
        MultiFillDialogComponent.enabledFillValidation = true;
        this.disabled = true;
        this.isGridValid = true;
        this.dataGrid.saveEditData().then((data) => {
            for (const result of data) {
                if (result.level === "ERROR") {
                    this.isGridValid = false;
                    this.toasterService.pop((result.level).toLowerCase(), "Multi-fill",
                     result.message + " " + (result.val ? result.val : ""));
                } else if ((result.level === "WARNING") && (!this.overWrite)) {
                    this.isGridValid = false;
                    this.toasterService.pop((result.level).toLowerCase(), "Multi-fill",
                     result.message + " " + (result.val ? result.val : ""));
                }
            }

            if (this.isGridValid) {
                const items = this.dataGrid.getData();

                for (let i = 0; i < items.length; i++) {
                    const msg = this.messageFactoryService.fill(items[i], items[i]);
                    this.orderStoreService.sendMessage(msg);
                }
                this.dialogRef.close();
            } else {
                this.disabled = false;
            }
        }).catch((err) => {
            this.disabled = false;
            this.toasterService.pop("error", "Send fill", err);
        });
    }

    public sendDfd() {
        MultiFillDialogComponent.enabledFillValidation = false;
        this.dataGrid.saveEditData().then((data) => {
            const items = this.dataGrid.getData();
            for (let i = 0; i < items.length; i++) {
                const msg = this.messageFactoryService.dfd(items[i], items[i]);
                this.orderStoreService.sendMessage(msg);
            }
            MultiFillDialogComponent.enabledFillValidation = true;
        }).catch((err) => {
            this.toasterService.pop("error", "Send fill", err);
            MultiFillDialogComponent.enabledFillValidation = true;
        });
        this.dialogRef.close();
    }

    public onToolbarPreparing(event) {
        event.toolbarOptions.items = [];
    }

    public validateFillQty(params) {

        if (!MultiFillDialogComponent.enabledFillValidation) {
            return true;
        }
        const maxQty = params.data.LeavesQty ? params.data.LeavesQty : params.data.OrderQty;
        if (params.value > maxQty || !params.value) {
            return false;
        }
        return true;
    }

    public validateFillPx(params) {
         if (!MultiFillDialogComponent.enabledFillValidation) {
            return true;
        }
        if (params.value > 0) {
            return true;
        }
        return false;
    }

    public validateFillPxDistance(params) {

        if (!MultiFillDialogComponent.getInstance().fillService.distanceOk(params.data, params.value)) {
            return false;
        }
        return true;
    }

    public validateFillPxSide(params) {
         if (!MultiFillDialogComponent.getInstance().fillService.sideOk(params.data, params.value)) {
            return false;
        }
        return true;
    }

    public rowClickEvent(e) {

    }

    public onRowPrepared(item) {

    }

}
