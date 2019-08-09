import {
    Component, ViewChild, OnInit, OnDestroy, ChangeDetectionStrategy,
    ChangeDetectorRef, ComponentFactoryResolver, Injector, ApplicationRef
} from "@angular/core";

import { MatDialog } from "@angular/material";

import { NotifyService } from "../../core/notify/notify.service";
import { HitlistSettingsService } from "../../core/hitlist-settings/hitlist-settings.service";
import { RestPortfolioService } from "../../rest/rest-portfolio.service";
import { RestPreferencesService } from "../../rest/rest-preferences.service";
import { PortfolioService } from "../portfolio.service";
import { MoneyService } from "../../core/money/money.service";
import { PreferencesState } from "../../preferences/state/preferences.state";
import { Subscription } from "rxjs/internal/Subscription";
import { Store } from "@ngxs/store";
import { LoggerService } from "../../core/logger/logger.service";
import { RestStockDataService } from "../../rest/rest-stock-data.service";
import { DialogAccComponent } from "../dialog-acc/dialog-acc.component";
import { environment } from "../../../environments/environment";
import { DataExchangeService, DockableComponent, Dockable, DockableHooks } from "@ra/web-components";

@Dockable({
    label: "Portfolio Grid",
    icon: "account_balance",
    single: false
})
@Component({
    selector: "ra-portfolio-table",
    templateUrl: "./portfolio-table.component.html",
    styleUrls: ["./portfolio-table.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioTableComponent extends DockableComponent implements OnInit, DockableHooks {
    private dataGrid: any;

    private infoSub: Subscription;
    private accountSub: Subscription;

    public inicialized = false;
    public initBalance = false;
    public valueBalance = 1;
    public valueUpdated = true;
    public orderColumns = [];
    public sumColumns = [{}];
    public balance = { allBalance: 0, allOpenBalance: 0 };
    public rowClick: {};
    public prefs = { currency: { name: "" } };
    public symbols = {};
    public showCompany = false;
    public account: string;
    private lastRow = {};
    private sumRow = {};

    constructor(
        private restPortfolioService: RestPortfolioService,
        private restPreferencesService: RestPreferencesService,
        private hitlistSettingsService: HitlistSettingsService,
        private portfolioService: PortfolioService,
        private restStockDataService: RestStockDataService,
        private moneyService: MoneyService,
        private toasterService: NotifyService,
        private changeDetectornRef: ChangeDetectorRef,
        private store: Store,
        private logger: LoggerService,
        public dialog: MatDialog,
        private dataExchangeService: DataExchangeService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
    }

    private updateRow(message) {
        this.dataGrid.updateRow(message);
    }

    private insertNewRow(message) {
        this.dataGrid.insertRow(message);
    }

    /* DXDATAGRID */
    private onRowInserted(values, key) {
        this.dataGrid.refresh().then(() => { });
    }

    /* DXDATAGRID */
    private onRowUpdated(values, key) {
        this.dataGrid.refresh().then(() => { });
    }

    ngOnInit() {
        this.prefs = this.store.selectSnapshot(PreferencesState.getPrefs);
        this.initTableColumns().then(
            (result) => {
                this.inicialized = true;
            }
        );
        this.infoSub = this.portfolioService.balanceInfo$.subscribe((balance) => {
            this.moneyService.setBalance(balance);
            this.balance = this.moneyService.balance;
            if ((balance.portfolio) && (this.dataGrid)) {
                this.updateRow(balance.portfolio);
                this.valueUpdated = false;
                this.changeDetectornRef.markForCheck();
            }
            this.lastRow["Quantity"] = Number(this.balance.allBalance).toFixed(2);
            this.initBalance = true;
            this.changeDetectornRef.markForCheck();
        });
    }

    public initData(company) {
        if (this.dataGrid) {
            this.dataGrid.beginCustomLoading("Loading...");
        }
        this.restPortfolioService.getPortfolio(company).then(
            async (data: any) => {
                this.valueBalance = 0;
                this.valueUpdated = true;
                data[0].push(this.lastRow);

                for (let i = 0; i < data[0].length; i++) {
                    let myPrice = data[0][i].CurrentPrice ? data[0][i].CurrentPrice : 0;

                    if (!(this.symbols[data[0][i].Symbol])) {
                        const symbol = await this.restStockDataService.getSymbolPx(data[0][i].Symbol);
                        if ((symbol) && (symbol[0]) && (symbol !== null)) {
                            this.symbols[symbol[0].symbol] = symbol[0];
                        } else {
                            this.symbols[data[0][i].Symbol] = "Not available";
                        }
                    }

                    if (!data[0][i].CurrentPrice) {
                        myPrice = this.symbols[data[0][i].Symbol] && (this.symbols[data[0][i].Symbol].lastPx) ?
                            this.symbols[data[0][i].Symbol].lastPx : myPrice;
                        data[0][i].CurrentPrice = myPrice;
                    }

                    // calculate portfolio value
                    this.valueBalance = this.valueBalance
                        + this.moneyService.recalculateMoney(data[0][i].Quantity * myPrice, data[0][i].Currency);

                    console.log("this.valueBalance", this.valueBalance);
                }

                this.dataGrid.setData(data[0]);
                this.dataGrid.setSumRow(this.sumRow);
                this.changeDetectornRef.markForCheck();

                this.account = null;
                if (this.dataGrid) {
                    this.dataGrid.endCustomLoading();
                }
            })
            .catch(error => { this.logger.error(error); });
    }

    public switchCompany() {
        this.showCompany = !this.showCompany;
        this.initData(this.showCompany);
    }

    dockableClose(): Promise<void> {
        if (this.infoSub) {
            this.infoSub.unsubscribe();
        }
        if (this.accountSub) {
            this.accountSub.unsubscribe();
        }
        return Promise.resolve();
    }
    dockableShow() {
    }
    dockableTab() {
    }
    dockableHide() {
    }

    public openAccount() {
        const dialogRef = this.dialog.open(DialogAccComponent, {
            width: "300px"
        });
        dialogRef.componentInstance.Account = this.account;

        this.accountSub = dialogRef.afterClosed().subscribe(result => {
            this.chooseAccount(result);
            this.accountSub.unsubscribe();
        });
    }

    chooseAccount(account: string) {
        this.account = account;
        if (account) {
            this.dataGrid.filter([
                ["Account", "=", account]
            ]);
        } else {
            this.dataGrid.clearFilter();
        }
    }

    public getData(typ, values) {
        const data = values.data ? values.data : values;
        switch (typ) {
            case "portfolio": {
                if (!data.Quantity) {
                    return null;
                }
                if ((this.valueBalance) && (this.valueBalance !== 0)) {
                    return ((this.moneyService.recalculateMoney((data.Quantity * data.CurrentPrice), data.Currency))
                        / (this.valueBalance + this.balance.allBalance)).toFixed(2);
                } else {
                    return 0;
                }
                break;
            }
            case "bookvalloc": {
                if (!data.Quantity) {
                    return null;
                }
                return (data.Quantity * data.BookPrice);
                break;
            }
            case "bookval": {
                if (!data.Quantity) {
                    return null;
                }
                return this.moneyService.recalculateMoney((data.Quantity * data.BookPrice), data.Currency);
                break;
            }
            case "curvalloc": {
                if (!data.Quantity) {
                    return null;
                }
                return (data.Quantity * data.CurrentPrice);
                break;
            }
            case "curval": {
                if (!data.Quantity) {
                    return null;
                }
                return this.moneyService.recalculateMoney(data.Quantity * data.CurrentPrice, data.Currency);
                break;
            }
            case "unrlzdloc": {
                if (!data.Quantity) {
                    return null;
                }
                return (data.Quantity * data.CurrentPrice) - (data.Quantity * data.BookPrice);
                break;
            }
            case "unrlzd": {
                if (!data.Quantity) {
                    return null;
                }
                return this.moneyService.recalculateMoney(data.Quantity * data.CurrentPrice, data.Currency)
                    - this.moneyService.recalculateMoney(data.Quantity * data.BookPrice, data.Currency);
                break;
            }
            case "unrlzdpct": {
                if (!data.Quantity) {
                    return null;
                }
                if ((this.moneyService.recalculateMoney(data.Quantity * data.BookPrice, data.Currency)) !== 0) {
                    return ((this.moneyService.recalculateMoney(data.Quantity * data.CurrentPrice, data.Currency)
                        - this.moneyService.recalculateMoney(data.Quantity * data.BookPrice, data.Currency))
                        / (this.moneyService.recalculateMoney(data.Quantity * data.BookPrice, data.Currency)));
                } else {
                    return 0;
                }
                break;
            }
            case "profit": {
                return this.moneyService.recalculateMoney(data.Profit, data.Currency);
                break;
            }
            default: {
                return data[typ];
            }
        }

    }

    private formatMoney(data, curval = false) {
        if (curval === true) {
            //            this.valueBalance = data.value;
            this.changeDetectornRef.markForCheck();
        }
        return this.moneyService.formatMoney(data.valueText ? data.valueText : data.value);
    }

    private clearValue(data) {
        return " ";
    }

    private initTableColumns(): Promise<boolean> {
        const that = this;
        return this.restPreferencesService.getAppPref("portfolio_columns").then((columns) => {
            for (let i = 0; i < columns.length; i++) {
                if ((columns[i].format) && (columns[i].format.precision)) {
                    columns[i].format.precision = environment.precision;
                }
                if (!columns[i].allowEditing && columns[i].allowEditing !== false) {
                    columns[i].allowEditing = function (data) { return !(data.data && data.data.raType === "sumRow"); };
                }
                if (columns[i].calculateCell) {
                    columns[i].calculateCellValue = function (data) { return that.getData(columns[i].calculateCell, data); };
                }
                if (columns[i].formatMoney) {
                    columns[i].customizeText = function (data) { return that.formatMoney(data, false); };
                }
                if (columns[i].templateCell) {
                    columns[i].cellTemplate = columns[i].templateCell;
                }
                if (columns[i].dataField === "Symbol") {
                    this.lastRow[columns[i].dataField] = "Cash balance";
                } else if (columns[i].dataField === "BookPrice") {
                    this.lastRow[columns[i].dataField] = Number(1).toFixed(2);
                } else if (columns[i].dataField === "Quantity") {
                    this.lastRow[columns[i].dataField] = Number(this.balance.allBalance).toFixed(2);
                } else if (columns[i].dataField === "Currency") {
                    this.lastRow[columns[i].dataField] = this.prefs.currency.name;
                } else if (columns[i].dataField === "CurrentPrice") {
                    this.lastRow[columns[i].dataField] = Number(1).toFixed(2);
                } else {
                    this.lastRow[columns[i].dataField] = "";
                }
            }
            this.lastRow["id"] = "aaa";
            this.sumRow["id"] = "aaaSum";

            return this.restPreferencesService.getAppPref("portfolio_sum_columns").then((sumcolumns) => {
                for (let i = 0; i < sumcolumns.totalItems.length; i++) {
                    if ((sumcolumns.totalItems[i].valueFormat) && (sumcolumns.totalItems[i].valueFormat.precision)) {
                        sumcolumns.totalItems[i].valueFormat.precision = environment.precision;
                    }
                    if (sumcolumns.totalItems[i].formatMoney) {
                        sumcolumns.totalItems[i].customizeText = function (data) {
                            return that.formatMoney(data, sumcolumns.totalItems[i].currentVal);
                        };
                    }
                    if (columns[i].calculateCell && sumcolumns.totalItems[i].summaryType && !sumcolumns.totalItems[i].clearValue) {
                        columns[i].calculateCellValue = function (data) {
                            if (that.testSumRow(data)) {
                                return that.calculateValue(columns[i].calculateCell, sumcolumns.totalItems[i].summaryType, data);
                            } else {
                                return that.getData(columns[i].calculateCell, data);
                            }
                        };
                    } else if (sumcolumns.totalItems[i].summaryType && !sumcolumns.totalItems[i].clearValue) {
                        columns[i].calculateCellValue = function (data) {
                            if (that.testSumRow(data)) {
                                return that.calculateValue(null, sumcolumns.totalItems[i].summaryType, data, columns[i].dataField);
                            } else {
                                return data.data[columns[i].dataField];
                            }
                        };
                    }
                }
                this.sumColumns = sumcolumns;
                this.orderColumns = columns;
                this.changeDetectornRef.markForCheck();
                return true;
            });
        });
    }


    public testSumRow(data) {
        return (data && data.data && data.data.raType === "sumRow");
    }

    public calculateValue(column, typ, values, col?) {
        let count = 0;
        let sum = 0;
        switch (typ) {
            case "count": {
                values.api.forEachNode((node) => {  if (!this.testSumRow(node)) { count++; } });
                return count;
            }
            case "sum": {
                values.api.forEachNode((node) => {
                    if (!this.testSumRow(node)) {
                        if (!col) {
                            sum += Number(this.getData(column, node));
                        } else {
                            sum += Number(node.data[col]);
                        }
                    }
                });
                return sum;
            }
            case "avg": {
                values.api.forEachNode((node) => {
                    if (!this.testSumRow(node)) {
                        count++;
                        if (!col) {
                            sum += Number(this.getData(column, node));
                        } else {
                            sum += Number(node.data[col]);
                        }
                    }
                });
                return sum / count;
            }
            default: {
                return null;
            }
        }
    }

    public onGridInitialized(ev) {
        this.dataGrid = ev.component ? ev.component : ev;
        this.dataGrid.loadState(ev);
        this.initData(false);
    }

    /**
     * Loading last saved table state
     * @param ev Grid component
     */
    loadState(ev) {
        this.hitlistSettingsService.loadState("portfolio", this.dataGrid);
    }

    /**
     * Saving last table state
     */
    saveState() {
        this.hitlistSettingsService.saveState("portfolio", this.dataGrid);
    }



    public saveChanges() {
        this.dataGrid.saveEditData().then((data) => {
            let formInvalid = false;
            for (const result of data) {
                if (result.level === "ERROR") {
                    formInvalid = true;
                    this.toasterService.pop((result.level).toLowerCase(), "Portofolio parameters",
                        result.message + " " + (result.val ? result.val : ""));
                }
            }

            if (!formInvalid) {
                const items = this.dataGrid.getData();
                for (let i = 0; i < items.length; i++) {
                    if (!(items[i].id).toString().startsWith("aaa")) {
                        const item = { ...items[i] };
                        for (const col of this.orderColumns) {
                            if (col.allowEditing === true) {
                            } else {
                                delete item[col.dataField];
                            }
                        }
                        item.id = items[i].id;
                        this.restPortfolioService.saveRecord(item).then(() => {
                            this.valueUpdated = false;
                            this.toasterService.pop("success", "Save portfolio", "Data succesfully saved");
                            this.changeDetectornRef.markForCheck();
                        }).catch((err) => {
                            this.toasterService.pop("error", "Save portfolio", err.message);
                        });
                    }
                }
            }
        }).catch((err) => {
            this.toasterService.pop("error", "Save portofilio", err);
        });
    }

    /* DXDATAGRID */
    updated(ev) {
        const item = { ...ev.data };
        item.id = ev.key;

        this.restPortfolioService.saveRecord(item).then(() => {
            this.valueUpdated = false;
            this.toasterService.pop("success", "Saved", "Data succesfully saved");

            this.changeDetectornRef.markForCheck();
        }).catch((err) => {
            this.toasterService.pop("error", "Save show me only", err.message);
        });
    }

    public rowClickEvent(e) {
        if ((!e) || (e.rowType !== "data")) { return; }

        this.rowClick = e.data;

        this.dataExchangeService.pushData({
            order: this.rowClick
        }, ["PORTFOLIO", "SYMBOL"]);
    }
}
