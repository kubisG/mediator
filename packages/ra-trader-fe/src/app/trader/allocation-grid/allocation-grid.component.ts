import { Component, OnInit, LOCALE_ID, Inject, OnDestroy, Input, EventEmitter, Output } from "@angular/core";
import { ToasterService } from "angular2-toaster";
import { RestAllocationsService } from "../../rest/rest-allocations.service";

import { RestAccountsService } from "../../rest/rest-accounts.service";
import { AllocStatus } from "@ra/web-shared-fe";
import { RestInputRulesService } from "../../rest/rest-input-rules.service";
import { LoggerService } from "../../core/logger/logger.service";
import { OrderAllocated } from "@ra/web-shared-fe";
import { HitlistSettingsService } from "../../core/hitlist-settings/hitlist-settings.service";
import { hitlistFormatValue } from "@ra/web-shared-fe";
import { environment } from "../../../environments/environment-trader.prod";
import { UIDService } from "../../core/uid.service";

@Component({
    selector: "ra-allocation-grid",
    templateUrl: "./allocation-grid.component.html",
    styleUrls: ["./allocation-grid.component.less"],
})
export class AllocationGridComponent implements OnInit, OnDestroy {
    private dataGrid: any;
    @Input() set raId(raId) {
        this._raId = raId;
        this.initData();
    }
    get raId() {
        return this._raId;
    }
    @Input() cumQty;
    @Input() allocated;
    @Input() disableEdit;
    @Output() sumEvt = new EventEmitter();

    public sumQty = 0;
    private rememberQty = 0;
    private formInvalid = false;
    private hitlistFormat = hitlistFormatValue;
    private env = environment;
    public _raId;
    public allocID;
    collapsed: boolean;
    public allocations;
    public accounts;
    public lists = {};
    public columns: any[];
    public disabled = false;
    public rowClick;
    private deletedRows: any[] = [];
    public orderStatus = {
        Sended: OrderAllocated.Sended,
        Allocated: OrderAllocated.Allocated
    };


    constructor(
        @Inject(LOCALE_ID) private locale: string,
        private uIDService: UIDService,
        private toasterService: ToasterService,
        private allocationsService: RestAllocationsService,
        private hitlistService: HitlistSettingsService,
        private restAccountsService: RestAccountsService,
        private listsService: RestInputRulesService,
        private logger: LoggerService
    ) {
        const that = this;
        this.loadLists().then((result) => {
            this.restAccountsService.getAccounts().then(
                (account) => {
                    this.accounts = account;

                    this.columns = [
                        {
                            caption: "Latest", dataField: "TransactTime", sort: "desc", valueFormatter: function (data) {
                                return that.hitlistFormat(data,
                                    { locale: that.locale, dataField: "TransactTime", dataType: "date", format: "HH:mm:ss.S" }
                                );
                            }
                        },
                        {
                            caption: "AllocAccount", dataField: "AllocAccount", valueFormatter: function (data) {
                                return that.hitlistFormat(data,
                                    {
                                        dataField: "AllocAccount", dataType: "lookup",
                                        lookup: { dataSource: that.accounts, valueExpr: "name", displayExpr: "name" }
                                    }
                                );
                            },
                            cellEditor: "select",
                            cellEditorParams: {
                                raLookup: { dataSource: that.accounts, valueExpr: "name", displayExpr: "name" }
                            },
                            raValidators: [
                                { required: true, message: "AllocAccount must be filled", level: "ERROR" }
                            ], allowEditing: function (row) {
                                return ((!row.data.AllocStatus || row.data.AllocStatus === AllocStatus.New)
                                    && (row.data.Canceled !== "Y") && (that.allocated !== OrderAllocated.Sended)
                                    && (that.allocated !== OrderAllocated.Allocated));
                            }
                        },
                        {
                            caption: "Alloc Shares", dataField: "AllocShares", type: ["numericColumn"],
                            cellEditor: "number",
                            cellEditorParams: {
                                raType: "numeric",
                                raMin: 0,
                                raMax: 99999999,
                                raPrecision: 0,
                            }
                            , raValidators: [
                                { required: true, message: "Shares must be filled", level: "ERROR" }
                            ]
                            , allowEditing: function (row) {
                                return ((!row.data.AllocStatus || row.data.AllocStatus === AllocStatus.New)
                                    && (row.data.Canceled !== "Y") && (that.allocated !== OrderAllocated.Sended)
                                    && (that.allocated !== OrderAllocated.Allocated));
                            }
                        },
                        { caption: "AllocID", dataField: "AllocID" },
                        {
                            caption: "Comm Type", dataField: "CommType", allowEditing: function (row) {
                                return ((!row.data.AllocStatus || row.data.AllocStatus === AllocStatus.New)
                                    && (row.data.Canceled !== "Y") && (that.allocated !== OrderAllocated.Sended)
                                    && (that.allocated !== OrderAllocated.Allocated));
                            }, valueFormatter: function (data) {
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
                            caption: "Commision", dataField: "Commision", allowEditing: function (row) {
                                return ((!row.data.AllocStatus || row.data.AllocStatus === AllocStatus.New)
                                    && (row.data.Canceled !== "Y") && (that.allocated !== OrderAllocated.Sended)
                                    && (that.allocated !== OrderAllocated.Allocated));
                            }, type: ["numericColumn"],
                            cellEditor: "number",
                            cellEditorParams: {
                                raType: "numeric",
                                raMin: 0,
                                raPrecision: that.env.precision,
                            }
                        },
                        {
                            caption: "AllocText", dataField: "AllocText", allowEditing: function (row) {
                                return ((!row.data.AllocStatus || row.data.AllocStatus === AllocStatus.New)
                                    && (row.data.Canceled !== "Y") && (that.allocated !== OrderAllocated.Sended)
                                    && (that.allocated !== OrderAllocated.Allocated));
                            }
                        },
                        { caption: "AllocStatus", dataField: "AllocStatus" }
                    ];
                }
            );
        });
    }

    /**
     * Loading last saved table state
     * @param ev Grid component
     */
    onInitialized(e) {
        this.dataGrid = e.component ? e.component : e;
        this.hitlistService.loadState("allocs", this.dataGrid);
        this.initData();
    }

    public saveChanges() {
        this.disabled = true;
        this.sumQty = 0;
        this.formInvalid = false;
        this.dataGrid.saveEditData().then((data) => {
            for (const result of data) {
                if (result.level === "ERROR") {
                    this.formInvalid = true;
                    this.toasterService.pop((result.level).toLowerCase(), "Multi-fill",
                        result.message + " " + (result.val ? result.val : ""));
                }
            }

            if (!this.formInvalid) {
                const items = this.dataGrid.getData();

                for (let i = 0; i < items.length; i++) {
                    if (((!items[i].AllocStatus) || (items[i].AllocStatus === AllocStatus.New)
                        || (items[i].AllocStatus === AllocStatus.Accepted)
                    ) && (items[i].Canceled !== "Y")) {
                        this.sumQty += (items[i].AllocShares ? Number(items[i].AllocShares) : 0);
                        if (this.sumQty > this.cumQty) {
                            this.toasterService.pop("error", "Allocations", "You dont have enough cumulated quantity.");
                            this.formInvalid = true;
                            break;
                        }
                    }
                }
                if (!this.formInvalid) {
                    // we have to save it
                    const someErr = false;
                    this.sumQty = 0;
                    for (const delRow of this.deletedRows) {
                        delRow.RaID = this.raId;
                        const id = delRow.id;
                        if (!(`${id}`).startsWith("A") || (delRow.newId)) {
                            delRow.id = delRow.newId ? delRow.newId : delRow.id;
                            this.allocationsService.delRecord(delRow).then(() => {
                                this.toasterService.pop("success", "Saved", "Data succesfully deleted");
                            }).catch((err) => {
                                this.toasterService.pop("error", "Problem with deleting data", err.message);
                            });
                        }
                    }
                    this.deletedRows = [];

                    for (let i = 0; i < items.length; i++) {
                        if (((!items[i].AllocStatus) || (items[i].AllocStatus === AllocStatus.New)
                            || (items[i].AllocStatus === AllocStatus.Accepted)
                        ) && (items[i].Canceled !== "Y")) {
                            const id = items[i].id;
                            if ((`${id}`).startsWith("A") && !(items[i].RaID)) {
                                delete items[i].id;
                                items[i].RaID = this.raId;
                            } else if (items[i].newId) {
                                items[i].id = items[i].newId;
                            }
                            this.allocationsService.saveRecord(items[i]).then((res) => {
                                this.sumQty += (items[i].AllocShares ? Number(items[i].AllocShares) : 0);
                                res.newId = res.id;
                                delete res.id;
                                res.id = id;
                                this.dataGrid.updateRow(res);
                                this.sumEvt.emit(this.sumQty);
                            }).catch((err) => {
                                this.toasterService.pop("error", "Problem with saving data", err.message);
                                this.dataGrid.updateRow({ id });
                            });
                        }
                    }
                    if (!someErr) {
                        this.toasterService.pop("success", "Saved", "Data succesfully saved");
                    }
                }
                this.disabled = false;
            } else {
                this.disabled = false;
            }
        }).catch((err) => {
            this.disabled = false;
            this.toasterService.pop("error", "Send fill", err);
        });
    }

    addRow() {
        const id = "A" + this.uIDService.nextInt();
        const res = this.dataGrid.addEmptyRow(id);
    }

    removeRow() {
        if (this.rowClick.Canceled !== "Y") {
            const res = this.dataGrid.removeRow(this.rowClick);
            this.deletedRows.push(this.rowClick);
            this.rowClick = null;
        }
    }


    /* DXGRID */
    rowValidating(e) {
        if (!this.rememberQty) {
            this.rememberQty = this.sumQty;
        }
        if ((e.newData.AllocShares) && (e.isValid) && (!this.formInvalid)) {
            const oldShares = e.oldData ? e.oldData.AllocShares : 0;
            const shares = e.newData.AllocShares - oldShares;
            if ((this.sumQty + shares) > this.cumQty) {
                e.errorText = "You dont have enough cumulated quantity.";
                e.isValid = false;
                this.formInvalid = true;
            } else {
                this.sumQty += shares;
                this.sumEvt.emit(this.sumQty);
            }
        }
        if (!e.isValid) {
            this.sumQty = this.rememberQty;
            this.sumEvt.emit(this.sumQty);
        }
    }

    private loadLists(): any {
        return this.listsService.getInputRules().then(
            (data) => {
                data = data.sort((a, b) => a.name.localeCompare(b.name));
                for (let i = 0; i < data.length; i++) {
                    if (!this.listsService[data[i].label]) {
                        this.lists[data[i].label] = [];
                    }
                    this.lists[data[i].label].push({ name: data[i].name, value: data[i].value });
                }
                return true;
            })
            .catch((error) => {
                this.logger.error(error);
                this.lists = [];
                return false;
            });
    }

    initData() {
        if ((this.raId) && (this.dataGrid)) {
            this.sumQty = 0;
            let allocID = false;
            this.allocationsService.getOrderAllocations(this.raId).then((messages) => {
                for (let i = 0; i < messages.length; i++) {
                    if (((messages[i].AllocStatus === AllocStatus.New) || (messages[i].AllocStatus === AllocStatus.Accepted)
                    ) && (messages[i].Canceled !== "Y")) {
                        this.sumQty += Number(messages[i].AllocShares);
                        if (!allocID) {
                            this.allocID = messages[i].AllocID;
                            allocID = true;
                        }
                    }
                }
                this.sumEvt.emit(this.sumQty);
                this.dataGrid.setData(messages);
            }).catch((err) => {
                this.toasterService.pop("error", "Load orders", err.message);
            });
        }
    }

    saveState() {
        this.hitlistService.saveState("allocs", this.dataGrid);
    }

    ngOnInit() {
    }


    ngOnDestroy() {
    }

    public rowClickEvent(e) {
        console.log(e);
        this.rowClick = e.data;

    }

    getRandomInt(max: number): number {
        return Math.floor(Math.random() * Math.floor(max));
    }
    /* DXGRID */

    updated(ev) {
        const item = { ...ev.data };
        item.RaID = this.raId;
        item.id = ev.key;
        this.rememberQty = null;
        this.allocationsService.saveRecord(item).then((result) => {
            this.toasterService.pop("success", "Saved", "Data succesfully saved");
        }).catch((err) => {
            this.toasterService.pop("error", "Problem with saving data", err.message);
        });
    }
    /* DXGRID */

    inserted(ev) {
        const item = { ...ev.data };
        item.RaID = this.raId;
        this.rememberQty = null;
        delete item.id;
        this.allocationsService.saveRecord(item).then((res) => {
            delete res.id;
            res.id = ev.key;
            this.dataGrid.updateRow(res);
            this.toasterService.pop("success", "Saved", "Data succesfully saved");
        }).catch((err) => {
            this.toasterService.pop("error", "Problem with saving data", err.message);
        });
    }
    /* DXGRID */

    deleted(ev) {
        const item = { ...ev.data };
        item.RaID = this.raId;
        this.allocationsService.delRecord(item).then(() => {
            this.sumQty = this.sumQty - item.AllocShares;
            this.sumEvt.emit(this.sumQty);
            this.toasterService.pop("success", "Saved", "Data succesfully deleted");
        }).catch((err) => {
            this.toasterService.pop("error", "Problem with deleting data", err.message);
        });
    }
    /* DXGRID */

    onCellPrepared(e) {
        if (e.rowType === "data" && ((e.column.command === "edit") || (e.column.command === "delete"))) {
            if ((e.row.data.AllocStatus !== AllocStatus.New) || (e.row.data.Canceled === "Y") || (this.allocated === OrderAllocated.Sended)
                || (this.allocated === OrderAllocated.Allocated)) {
                const editLink = e.cellElement.querySelector(".dx-link-edit");
                if (editLink) {
                    editLink.remove();
                }
                const delLink = e.cellElement.querySelector(".dx-link-delete");
                if (delLink) {
                    delLink.remove();
                }
            }
        }
    }

    onEditorPreparing(e: any): void {
        if ((this.disableEdit) || (this.allocated === OrderAllocated.Sended)
            || (this.allocated === OrderAllocated.Allocated)) {
            e.editorOptions.disabled = true;
        } else {
            if ((e.row.rowType === "data") && (e.row.data.AllocStatus !== AllocStatus.New)) {
                e.editorOptions.disabled = !e.row.inserted;
            } else {
                e.editorOptions.disabled = false;
            }
        }
    }

    onRowPrepared(item) {
        if (item.data) {
            if ((item.data["Canceled"]) && (item.data["Canceled"] === "Y")) {
                item.rowElement.classList.add("canceled");
            }
        }
    }
}

