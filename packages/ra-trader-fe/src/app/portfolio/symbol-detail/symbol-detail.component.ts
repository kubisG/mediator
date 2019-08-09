import {
    Component, LOCALE_ID, OnInit, Inject, Input, ChangeDetectionStrategy,
    ChangeDetectorRef, ComponentFactoryResolver, Injector, ApplicationRef
} from "@angular/core";

import DataSource from "devextreme/data/data_source";
import ArrayStore from "devextreme/data/array_store";

import { HitlistSettingsService } from "../../core/hitlist-settings/hitlist-settings.service";
import { DxDataGridComponent } from "devextreme-angular/ui/data-grid";
import { LoggerService } from "../../core/logger/logger.service";
import { RestStockDataService } from "../../rest/rest-stock-data.service";
import { environment } from "../../../environments/environment";
import { Dockable, DockableComponent, DataExchangeService } from "@ra/web-components";
import { hitlistFormatValue } from "@ra/web-shared-fe";

@Dockable({
    label: "Symbol Detail",
    icon: "monetization_on",
    single: false
})
@Component({
    selector: "ra-symbol-detail",
    templateUrl: "./symbol-detail.component.html",
    styleUrls: ["./symbol-detail.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SymbolDetailComponent extends DockableComponent implements OnInit {
    set fillsRow(fillsRow) {
        this._fillsRow = fillsRow;
        this.loadData();
    }
    get fillsRow() {
        return this._fillsRow;
    }

    private dataGrid;

    public env = environment;
    public hitlistFormat = hitlistFormatValue;
    collapsed: boolean;
    private _fillsRow;
    public columns: any[];


    constructor(
        @Inject(LOCALE_ID) private locale: string,
        private restStockDataService: RestStockDataService,
        private hitlistSettingsService: HitlistSettingsService,
        private changeDetectorRef: ChangeDetectorRef,
        private logger: LoggerService,
        private dataExchangeService: DataExchangeService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
        const that = this;

        this.columns = [
            {
                caption: "Price Date", dataField: "priceDate", sort: "desc", valueFormatter: function (data) {
                    return that.hitlistFormat(data,
                        { locale: that.locale, dataField: "priceDate", dataType: "date", format: "y/MM/dd" }
                    );
                }
            },
            { caption: "StartPx", dataField: "startPx", type: ["numericColumn"]  },
            { caption: "LastPx", dataField: "LastPx", type: ["numericColumn"] },
            { caption: "LowPx", dataField: "lowPx", type: ["numericColumn"] },
            { caption: "HighPx", dataField: "highPx", type: ["numericColumn"]  },
            { caption: "Volume", dataField: "volume", type: ["numericColumn"]  },
        ];
    }


    private loadData() {
        if (this.fillsRow) {
            this.restStockDataService.getSymbolAllPx(this.fillsRow.Symbol).then(
                (data: any) => {
                    this.dataGrid.setData(data);
                    this.changeDetectorRef.markForCheck();
                })
                .catch(error => { this.logger.error(error); });
        } else {
            this.dataGrid.setData([]);
            this.dataGrid.endCustomLoading();
        }
    }

    /**
     * Loading last saved table state
     * @param ev Grid component
     */
    onInitialized(e) {
        this.dataGrid = e.component ? e.component : e;
        this.loadState(e);
        this.loadData();
    }

    ngOnInit() {

        const actData = this.dataExchangeService.getActData("SYMBOL");
        if (actData.key && (actData.data) && (actData.data !== null)) {
            this.fillsRow = actData.data.order;
        }

        this.dataSub = this.dataExchangeService.getData().subscribe((data) => {
            console.log("SYMBOL", data);
            if ((data.key.indexOf("SYMBOL") > -1) && (this.isBind) && (data.data) && (data.data !== null)
            && (this.fillsRow !== data.data.order)) {
                console.log("fills",  data.data.order);
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
        this.hitlistSettingsService.saveState("symbols", this.dataGrid);
    }

    loadState(ev) {
        this.hitlistSettingsService.loadState("symbols", this.dataGrid);
    }

    private clearList() {
        this.dataGrid.setData([]);
    }

    public reloadDataGrid() {
        this.clearList();
        this.loadData();
    }

}
