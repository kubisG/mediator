import { Component, OnInit, ComponentFactoryResolver, Injector, ApplicationRef, LOCALE_ID, Inject } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Observable } from "rxjs/internal/Observable";
import { ConfirmDialogComponent } from "@ra/web-shared-fe";
import { FormsSpecDialogComponent } from "../forms-spec-dialog/forms-spec-dialog.component";
import { RestFormsSpecService } from "../../rest/forms-rest-spec.service";
import { DockableComponent, Dockable } from "@ra/web-components";
import { hitlistFormatValue } from "@ra/web-shared-fe";
import { RestCompaniesService } from "@ra/web-admin-fe";
import { ToasterService } from "angular2-toaster";

@Dockable({
    label: "Forms Setup",
    icon: "edit"
})
@Component({
    selector: "ra-forms-spec",
    templateUrl: "forms-spec.component.html",
    styleUrls: ["forms-spec.component.less"]
})
export class FormsSpecComponent extends DockableComponent implements OnInit {


    private dataGrid;
    public columns;
    public hitlistFormat = hitlistFormatValue;
    public companies: any[];

    public actions = [
        {
            label: "Update",
            icon: "loop",
            visible: (data) => {
                return true;
            },
        },
        {
            label: "Delete",
            icon: "delete",
            visible: (data) => {
                return true;
            }
        }
    ];

    constructor(
        @Inject(LOCALE_ID) private locale: string,
        public restFormsSpecService: RestFormsSpecService,
        private restCompaniesService: RestCompaniesService,
        private toasterService: ToasterService,
        public dialog: MatDialog,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
        const that = this;
        this.restCompaniesService.getCompanies().then((comp) => {
            console.log("comp", comp);
            this.companies = comp[0];
            this.companies.push({ id: 0, companyName: "APP" });
            this.columns = [
                {
                    caption: "Company", dataField: "company.companyName"
                },
                {
                    caption: "Created", dataField: "createDate", valueFormatter: (data) => {
                        return that.hitlistFormat(data,
                            { locale: that.locale, dataField: "createDate", dataType: "date", format: "y/MM/dd" }
                        );
                    }
                },
                { caption: "Name", dataField: "name" },
                { caption: "Definition", dataField: "spec", valueFormatter: (data) => {
                    return JSON.stringify(data.data.spec);
                } },
                { caption: "Typ", dataField: "dataType" },
            ];
        });
    }


    public rowActionClick(e) {
        console.log("row click", e);
        switch (e.action.label) {
            case "Update": {
                this.myEdit(e.data.data);
                break;
            }
            case "Delete": {
                this.myDelete(e.data.data);
                break;
            }
            default: {
                break;
            }
        }
    }

    private loadData() {
        this.restFormsSpecService.getAllData().then((data) => {
            this.dataGrid.setData(data);
        }).catch((err) => {
            console.log(err);
        });
    }

    saveState() {
        // TBD
        // this.hitlistSettingsService.saveState("admin-prefs", this.dataGrid);
    }

    /**
     * Loading last saved table state
     * @param ev Grid component
     */
    loadState(ev) {
        // TBD
        // this.hitlistSettingsService.loadState("admin-prefs", ev.component ? ev.component : this.dataGrid);
    }

    public onInitialized(e) {
        this.dataGrid = e.compoment ? e.component : e;
        this.loadState(e);
        this.loadData();
    }

    private specDialog(data: any): Observable<any> {
        const dialogRef = this.dialog.open(FormsSpecDialogComponent, {
            width: "95vw",
            height: "85vh",
            data: {
                data,
                companies: this.companies,
            }
        });
        return dialogRef.afterClosed();
    }

    public newSpec() {
        this.myEdit({
            spec: null,
            type: "N",
            company: {},
        });
    }

    public myEdit(data: any) {
        this.specDialog(data).subscribe((result) => {
            if (result) {
                this.restFormsSpecService.saveData(result).then(() => {
                    if (data.id) {
                        result.id = data.id;
                        this.dataGrid.updateRow(result);
                        this.toasterService.pop("info", "Updated", "Definition successfully updated");
                    } else {
                        this.dataGrid.insertRow(result);
                        this.toasterService.pop("info", "Created", "Definition successfully created");
                    }
                }).catch((err) => {
                    this.toasterService.pop("error", "Save error", err);
                    console.log(err);
                });
            }
        });
    }

    private confirmDelete(data: any) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: { text: "Are you sure to delete?" }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.restFormsSpecService.deleteData(data).then(() => {
                    this.dataGrid.updateRow({ id: data.id });
                    this.toasterService.pop("info", "Deleted", "Definition successfully deleted");
                }).catch((err) => {
                    this.toasterService.pop("error", "Save error", err);
                    console.log(err);
                });
            }
        });
    }

    public myDelete(data: any) {
        this.confirmDelete(data);
    }

    public ngOnInit(): void {
    }

}
