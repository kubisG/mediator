import { Component, OnInit, ViewChild, OnDestroy, Input, EventEmitter, Output } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular/ui/data-grid";

import { DataGridService } from "../../data-grid/data-grid.service";
import { DataGridControl } from "../../data-grid/data-grid-control";
import { DataSourceControl } from "../../data-grid/data-source-control";
import { RestAccountsService } from "../../rest/rest-accounts.service";
import { RestInputRulesService } from "../../rest/rest-input-rules.service";
import { LoggerService } from "../../core/logger/logger.service";
import { UIDService } from "../../core/uid.service";
import { HitlistSettingsService } from "../../core/hitlist-settings/hitlist-settings.service";
import { hitlistFormatValue } from "@ra/web-shared-fe";

@Component({
    selector: "ra-broker-allocation-grid",
    templateUrl: "./allocation-grid.component.html",
    styleUrls: ["./allocation-grid.component.less"],
})
export class AllocationGridComponent implements OnInit, OnDestroy {
    private dataGrid: any;
    @Input() set allocs(allocs) {
        this._allocs = allocs;
    }
    get allocs() {
        return this._allocs;
    }
    @Input() cumQty;
    @Output() sumEvt = new EventEmitter();

    public _allocs;
    public allocID;
    dataGridControl: DataGridControl;
    dataSourceControl: DataSourceControl;
    collapsed: boolean;
    public allocations;
    public accounts = [];
    public lists = {};
    public columns: any[];
    private hitlistFormat = hitlistFormatValue;

    constructor(
        private hitlistService: HitlistSettingsService,
        private restAccountsService: RestAccountsService,
        private listsService: RestInputRulesService,
        private logger: LoggerService,
        private uIDService: UIDService,
    ) {
        const that = this;
        this.columns = [
            { caption: "AllocAccount", dataField: "AllocAccount" },
            { caption: "AllocShares", dataField: "AllocShares", type: ["numericColumn"] },
            { caption: "Commission", dataField: "Commission", type: ["numericColumn"] },
            { caption: "AllocText", dataField: "AllocText" },
            {
                caption: "CommType", dataField: "CommType", valueFormatter: function (data) {
                    return that.hitlistFormat(data,
                        {
                            dataField: "CommType", dataType: "lookup",
                            lookup: { dataSource: that.lists["CommType"], valueExpr: "value", displayExpr: "name" }
                        }
                    );
                }
            },
        ];
    }

    /**
     * Loading last saved table state
     * @param ev Grid component
     */
    onInitialized(e) {
        this.dataGrid = e.component ? e.component : e;
        this.hitlistService.loadState("broker-allocs", this.dataGrid);
        this.allocs.NoAllocs.map((val) => {
            val["id"] = this.uIDService.nextInt();
        });
        this.dataGrid.setData(this.allocs.NoAllocs);
    }


    private loadLists() {
        this.listsService.getInputRules().then(
            (data) => {
                data = data.sort((a, b) => a.name.localeCompare(b.name));
                for (let i = 0; i < data.length; i++) {
                    if (!this.listsService[data[i].label]) {
                        this.lists[data[i].label] = [];
                    }
                    this.lists[data[i].label].push({ name: data[i].name, value: data[i].value });
                }
            })
            .catch((error) => {
                this.logger.error(error);
                this.lists = [];
            });
    }



    saveState() {
        this.hitlistService.saveState("broker-allocs", this.dataGrid);
    }

    ngOnInit() {
        this.loadLists();
        this.restAccountsService.getAccounts().then(
            (data) => { this.accounts = data; }
        );
    }


    ngOnDestroy() {
    }
}

