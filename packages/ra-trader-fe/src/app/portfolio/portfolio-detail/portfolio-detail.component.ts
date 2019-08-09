import {
    Component, ViewChild, OnInit, OnDestroy, Input,
    ChangeDetectionStrategy, ChangeDetectorRef, ComponentFactoryResolver, Injector, ApplicationRef, Inject
} from "@angular/core";

import DataSource from "devextreme/data/data_source";
import ArrayStore from "devextreme/data/array_store";

import { HitlistSettingsService } from "../../core/hitlist-settings/hitlist-settings.service";
import { RestPreferencesService } from "../../rest/rest-preferences.service";
import { DxDataGridComponent } from "devextreme-angular/ui/data-grid";
import { RestInputRulesService } from "../../rest/rest-input-rules.service";
import { LoggerService } from "../../core/logger/logger.service";
import { ExecTransType } from "@ra/web-shared-fe";
import { RestTraderService } from "../../rest/rest-trader.service";
import { environment } from "../../../environments/environment";
import { DockableComponent, Dockable, DataExchangeService } from "@ra/web-components";

@Dockable({
    label: "Portfolio Detail",
    icon: "account_balance_wallet",
    single: false
})
@Component({
    selector: "ra-portfolio-detail",
    templateUrl: "./portfolio-detail.component.html",
    styleUrls: ["./portfolio-detail.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioDetailComponent extends DockableComponent implements OnInit {
    @Input() set fillsRow(fillsRow) {
        this._fillsRow = fillsRow;
        this.loadData();
    }
    get fillsRow() {
        return this._fillsRow;
    }

    private dataGrid: any;

    public orderColumns: any[];
    collapsed: boolean;
    private _fillsRow;
    public lists = {};


    constructor(
        private restOrdersService: RestTraderService,
        private restPreferencesService: RestPreferencesService,
        private listsService: RestInputRulesService,
        private hitlistSettingsService: HitlistSettingsService,
        private changeDetectorRef: ChangeDetectorRef,
        private logger: LoggerService,
        private dataExchangeService: DataExchangeService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
    }

    private loadData() {
        if (this.fillsRow) {
            this.restOrdersService.getTrades(this.fillsRow.Symbol, this.fillsRow.Currency).then(
                (trades: any) => {
                    this.dataGrid.setData(trades);
                    this.changeDetectorRef.markForCheck();
                })
                .catch(error => { this.logger.error(error); });
        } else {
            this.dataGrid.setData([]);
            this.dataGrid.endCustomLoading();
        }
    }

    ngOnInit() {
        this.initLookupValues();
        const actData = this.dataExchangeService.getActData("PORTFOLIO");
        if (actData.key && (actData.data) && (actData.data !== null)) {
            this.fillsRow = actData.data.order;
        }

        this.dataSub = this.dataExchangeService.getData().subscribe((data) => {
            if ((data.key.indexOf("PORTFOLIO") > -1) && (this.isBind) && (data.data) && (data.data !== null)
            && (this.fillsRow !== data.data.order)) {
                this.fillsRow = data.data.order;
            }
        });

        this.clickSub = this.getHeaderResult().subscribe((data) => {
            this.isBind = data.isActive;
        });
    }


    /**
     * Saving last table state
     */
    saveState() {
        this.dataGrid.saveState();
    }

    initLookupValues() {
        this.listsService.getInputRules().then(
            (data) => {
                data = data.sort((a, b) => a.name.localeCompare(b.name));
                for (let i = 0; i < data.length; i++) {
                    if (!this.lists[data[i].label]) {
                        this.lists[data[i].label] = [];
                    }
                    this.lists[data[i].label].push({ name: data[i].name, value: data[i].value });
                }
                // fill
                this.initTableColumns();
            })
            .catch((error) => {
                this.logger.error(error);
                this.lists = [];
            });

    }

    onInitialized(e) {
        this.dataGrid = e.component ? e.component : e;
        this.dataGrid.loadState();
        this.loadData();
    }

    private initTableColumns() {
        const that = this;
        this.restPreferencesService.getAppPref("portfolio_detail_columns").then((columns) => {
            for (let i = 0; i < columns.length; i++) {
                if ((columns[i].format) && (columns[i].format.precision)) {
                    columns[i].format.precision = environment.precision;
                }
                if (columns[i].lookup) {
                    columns[i].lookup = { "dataSource": this.lists[columns[i].dataField], "displayExpr": "name", "valueExpr": "value" };
                }
            }
            this.orderColumns = columns;
            this.changeDetectorRef.markForCheck();
        });
    }

    private clearList() {
        this.dataGrid.setData([]);
    }

    public reloadDataGrid() {
        this.clearList();
        this.loadData();
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
