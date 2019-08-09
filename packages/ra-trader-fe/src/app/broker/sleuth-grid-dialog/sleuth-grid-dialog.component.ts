import {
    Component, OnInit, LOCALE_ID, Inject, ComponentFactoryResolver, Injector, ApplicationRef
} from "@angular/core";

import { RestSleuthService } from "../../rest/rest-sleuth.service";
import { NotifyService } from "../../core/notify/notify.service";
import { parseJsonMessage } from "../../core/utils";
import { UIDService } from "../../core/uid.service";
import { environment } from "../../../environments/environment-trader.prod";
import { DockableComponent, Dockable } from "@ra/web-components";
import { DataExchangeService } from "@ra/web-components";
import { MatDialogRef } from "@angular/material";
import { hitlistFormatValue } from "@ra/web-shared-fe";
import { HitlistSettingsService } from "../../core/hitlist-settings/hitlist-settings.service";

@Dockable({
    label: "Sleuth Grid",
    icon: "image_search",
    single: false
})
@Component({
    selector: "ra-broker-sleuth-grid-dialog",
    templateUrl: "./sleuth-grid-dialog.component.html",
    styleUrls: ["./sleuth-grid-dialog.component.less"]
})
export class SleuthGridDialogComponent extends DockableComponent implements OnInit {
    private dataGrid;

    collapsed: boolean;
    dialogRef: MatDialogRef<SleuthGridDialogComponent>;
    public accounts = [];
    public lists = {};
    public dataLoaded = false;
    public mydata;
    public env = environment;
    public hitlistFormat = hitlistFormatValue;
    public columns: any[];


    constructor(
        @Inject(LOCALE_ID) private locale: string,
        private sleuthService: RestSleuthService,
        private hitlistSettingsService: HitlistSettingsService,
        private toasterService: NotifyService,
        private uIDService: UIDService,
        private dataExchangeService: DataExchangeService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
        try {
            this.dialogRef = (this.injector.get(MatDialogRef) as any);
        } catch (ex) {
        }

        const that = this;

        this.columns = [
            {
                caption: "Placed", dataField: "Placed", valueFormatter: function (data) {
                    return that.hitlistFormat(data,
                        { locale: that.locale, dataField: "createDate", dataType: "date", format: "y/MM/dd HH:mm:ss.S" }
                    );
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
            { caption: "Client", dataField: "ClientID" },
            { caption: "CumQty", dataField: "CumQty" },
            { caption: "AvgPx", dataField: "AvgPx", type: ["numericColumn"] },
            {
                caption: "Proximity", dataField: "Proximity", sort: "asc", valueFormatter: function (data) {
                    if (!data.data) {
                        return data;
                    }
                    return (that.getProximity(data.data) * 100).toFixed(2) + "%";
                }, cellStyle: function (item) {
                    if (!item.data) {
                        return item;
                    }

                    const proximity = (that.getProximity(item.data) * 100);
                    if (Math.abs(proximity) <= 1) {
                        return { backgroundColor: "#FF3333", color: "black" };
                    } else if ((Math.abs(proximity) > 1) && (Math.abs(proximity) <= 5)) {
                        return { backgroundColor: "#c7c724", color: "black" };
                    } else {
                        return { backgroundColor: "#66B2FF", color: "black" };
                    }
                }, comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                    if ((!nodeA.data) || (!nodeB.data)) {
                        return 1;
                    }
                    const proximityA = (that.getProximity(nodeA.data) * 100);
                    const proximityB = (that.getProximity(nodeB.data) * 100);
                    return proximityA - proximityB;
                }
            }
        ];
    }


    /**
     * Loading last saved table state
     * @param ev Grid component
     */
    onInitialized(e) {
        this.dataGrid = e.component ? e.component : e;
        this.hitlistSettingsService.loadState("sleuth", this.dataGrid);
        this.loadOrders();
    }

    public loadOrders() {
        if (!this.mydata) {
            this.dataGrid.endCustomLoading();
            return;
        }
        this.dataGrid.beginCustomLoading("Loading...");
        this.sleuthService.getSleuthData(this.mydata).then((orders) => {
            parseJsonMessage(orders);
            orders.map((val) => {
                val["id"] = this.uIDService.nextInt();
                val["AvgPx"] = val["AvgPx"] > 0 ? val["AvgPx"] : val["Price"];
                val["CumQty"] = val["CumQty"] > 0 ? val["CumQty"] : val["OrderQty"];
            });
            this.dataGrid.setData(orders);
            this.dataGrid.endCustomLoading();
        }).catch((err) => {
            this.toasterService.pop("error", "Load orders", err.message);
        });
    }


    saveState() {
        this.hitlistSettingsService.saveState("sleuth", this.dataGrid);
    }

    ngOnInit() {
        const actData = this.dataExchangeService.getActData("SLEUTH");

        if (actData.key && (actData.data) && (actData.data !== null)) {
            this.mydata = actData.data.order;
            this.lists = actData.data.lists;
        }

        this.dataSub = this.dataExchangeService.getData().subscribe((data) => {
            if ((data.key.indexOf("SLEUTH") > -1) && (this.isBind) && (data.data) && (data.data !== null)) {
                this.mydata = data.data.order;
                this.lists = data.data.lists;
                this.loadOrders();
            }
        });

        this.clickSub = this.getHeaderResult().subscribe((data) => {
            this.isBind = data.isActive;
        });
    }

    // public onRowPrepared(item) {
    //     if (item.data) {
    //         if (this.mydata) {
    //             let proximity = 0;
    //             let price = Number(this.mydata.Price);
    //             if (this.mydata.AvgPx && Number(this.mydata.AvgPx) > 0) {
    //                 price = Number(this.mydata.AvgPx);
    //             }

    //             if (((price - (item.data.AvgPx ? Number(item.data.AvgPx) : 0) !== 0))
    //                 && (price !== 0)) {
    //                 proximity = ((price - (item.data.AvgPx ? Number(item.data.AvgPx) : 0))
    //                     / price) * 100;
    //             } else {
    //                 proximity = 0;
    //             }

    //             if (Math.abs(proximity) <= 1) {
    //                 item.rowElement.style.backgroundColor = "#FF3333";
    //             } else if ((Math.abs(proximity) > 1) && (Math.abs(proximity) <= 5)) {
    //                 item.rowElement.style.backgroundColor = "#c7c724";
    //             } else {
    //                 item.rowElement.style.backgroundColor = "#66B2FF";
    //             }
    //         }
    //     }
    // }

    public getProximity(item) {
        if (this.mydata) {
            let price = Number(this.mydata.Price);
            if (this.mydata.AvgPx && Number(this.mydata.AvgPx) > 0) {
                price = Number(this.mydata.AvgPx);
            }

            if ((price) && (price > 0)) {
                if ((((price - (item.AvgPx ? Number(item.AvgPx) : 0)) !== 0)) && (price !== 0)) {
                    return Math.abs((price - (item.AvgPx ? Number(item.AvgPx) : 0)) / price);
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    public onNoClick() {
        this.dialogRef.close();
    }
}

