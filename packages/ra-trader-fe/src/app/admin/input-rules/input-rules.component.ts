import { OnDestroy, OnInit, Component, ViewChild, ComponentFactoryResolver, ApplicationRef, Injector } from "@angular/core";

import { RestInputRulesService } from "../../rest/rest-input-rules.service";
import { MatDialog } from "@angular/material";
import { InputRulesDialogComponent } from "../input-rules-dialog/input-rules-dialog.component";
import { InputRulesAdminService } from "./input-rules-admin.service";
import { NotifyService } from "../../core/notify/notify.service";
import { RestCompaniesService } from "../../rest/rest-companies.service";
import { Dockable, LayoutRights, DockableComponent } from "@ra/web-components";
import { hitlistFormatValue } from "@ra/web-shared-fe";
import { HitlistSettingsService } from "../../core/hitlist-settings/hitlist-settings.service";

@LayoutRights({
    roles: ["ADMIN"]
})
@Dockable({
    label: "Data settings",
    icon: "low_priority",
    single: false
})
@Component({
    selector: "ra-input-rules",
    templateUrl: "input-rules.component.html",
    styleUrls: ["input-rules.component.less"]
})
export class InputRulesComponent extends DockableComponent implements OnInit {
    private dataGrid;

    public lists: any[] = [];
    private rowData: any[] = [];

    collapsed: boolean;
    companies: any[] = [];
    public columns: any[];
    public hitlistFormat = hitlistFormatValue;

    public actions = [
        {
            label: "Update",
            icon: "loop",
            visible: (data) => {
                return true;
            },
        }
    ];

    constructor(
        private restInputRulesService: RestInputRulesService,
        private hitlistSettingsService: HitlistSettingsService,
        private inputRulesService: InputRulesAdminService,
        public dialog: MatDialog,
        private toasterService: NotifyService,
        private restCompaniesService: RestCompaniesService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
        const that = this;
        this.restCompaniesService.getCompanies().then((data) => {
            this.companies = data[0];
            this.companies.unshift({ id: 0, companyName: "All" });
        });

        this.columns = [
            {
                caption: "Company", dataField: "companyId", valueFormatter: function (data) {
                    return that.hitlistFormat(data,
                        {
                            dataField: "companyId", dataType: "lookup",
                            lookup: { dataSource: that.companies, valueExpr: "id", displayExpr: "companyName" }
                        }
                    );
                }
            },
            { caption: "Label", dataField: "label" },
            { caption: "Name", dataField: "name" },
            { caption: "Value", dataField: "value" },
        ];

    }


    public rowActionClick(e) {
        switch (e.action.label) {
            case "Update": {
                this.editRule(e.data.data);
                break;
            }
            default: {
                break;
            }
        }
    }

    public onInitialized(e) {
        this.dataGrid = e.compoment ? e.component : e;
        this.loadState(e);
        this.loadData();
    }


    /**
     * Saving last table state
     */
    saveState() {
        this.hitlistSettingsService.saveState("input-rules", this.dataGrid);
    }

    /**
     * Loading last saved table state
     * @param ev Grid component
     */
    loadState(ev) {
        this.hitlistSettingsService.loadState("input-rules", ev.component ? ev.component : this.dataGrid);
    }

    editRule(rule) {
        const modelItems = this.inputRulesService.getModelItems(rule, this.rowData);
        const dialogRef = this.dialog.open(InputRulesDialogComponent, {
            data: { items: modelItems, rules: this.lists }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.restInputRulesService.saveInputRules(result).then((data) => {
                    if (result.inputs.length > 0) {
                        this.toasterService.pop("info", "Updated record", result.inputs[0].item.label + " "
                            + result.inputs[0].item.name + " successfully updated");
                    } else if (result.del.length > 0) {
                        this.toasterService.pop("info", "Deleted record", result.del[0].label + " "
                            + result.del[0].name + " successfully deleted");
                    }
                    this.loadData();
                });
            }
        });
    }

    newInput() {
        const dialogRef = this.dialog.open(InputRulesDialogComponent, {
            data: { items: [{ id: -1, relid: -1, parentId: null, rootId: null, label: "", value: "", state: "N" }], rules: this.lists }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.restInputRulesService.saveInputRules(result).then((data) => {
                    this.toasterService.pop("info", "New record", result.inputs[0].item.label + " "
                        + result.inputs[0].item.name + " successfully inserted");
                    this.dataGrid.insertRow(data);
                    this.rowData.push(data);
                });
            }
        });
    }

    ngOnInit(): void {
    }

    private loadData() {
        this.lists = [];
        this.restInputRulesService.getAdminInputRules().then((data) => {
            data = data.sort((a, b) => a.name.localeCompare(b.name));
            for (let i = 0; i < data.length; i++) {
                if (!this.lists[data[i].label]) {
                    this.lists[data[i].label] = [];
                }
                this.lists[data[i].label].push({ id: data[i].id, name: data[i].name, value: data[i].value });
            }

            this.rowData = data;
            this.dataGrid.setData(data);
        });
    }

}
