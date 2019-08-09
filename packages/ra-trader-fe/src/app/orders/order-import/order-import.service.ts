import { Injectable } from "@angular/core";
import * as  csvtojson from "csvtojson";
import { NotifyService } from "../../core/notify/notify.service";
import { OrderPackage } from "@ra/web-shared-fe";
import { ReplaySubject } from "rxjs/internal/ReplaySubject";
import { Observable } from "rxjs/internal/Observable";

@Injectable()
export class OrderImportService {

    private reloadDataNotify: ReplaySubject<any> = new ReplaySubject<any>(1);
    public reloadDataNotify$: Observable<any> = this.reloadDataNotify.asObservable();

    private orders = [];
    private selected = [];
    public dataSrc;
    public arrayStore;

    private mandatoryKeys = ["Side", "Symbol", "SecurityID", "OrderQty"
        , "OrdType", "Currency", "SecurityIDSource", "ExDestination", "TargetCompID", "HandlInst", "TimeInForce"
        , "BookingType"];

    private allowedyKeys = ["Side", "Symbol", "SecurityID", "OrderQty",
        "Price", "StopPx", "OddLot", "SettlDate", "Currency", "LocateReqd", "ExecInst", "TimeInForce", "ExpireDate",
        , "OrdType", "Currency", "SecurityIDSource", "ExDestination", "HandlInst",
        "OnBehalfOfSubID", "Account", "SecurityDesc", "TradeDate", "TargetCompID",
        "OrderCapacity", "CommType", "DeliverToSubID", "Commission", "Text", "BookingType"
    ];

    private dateKeys = ["ExpireDate", "SettlDate", "TradeDate"];

    constructor(
        private toasterService: NotifyService
    ) {
        this.clearImports();
    }

    private checkMessage(message: any): any {
        let result = true;
        let errmsg: string;
        for (let i = 0; i < this.mandatoryKeys.length; i++) {
            if ((!message[this.mandatoryKeys[i]]) || (message[this.mandatoryKeys[i]] === null)) {
                result = false;
                errmsg = errmsg ? errmsg + "," + this.mandatoryKeys[i] : this.mandatoryKeys[i];
            }
        }
        return { result: result, errmsg: errmsg };
    }

    insertCsvFile(file: any) {
        const fileReader = new FileReader();
        fileReader.onloadend = (e: any) => {
            csvtojson().fromString(e.target.result).then((csv) => {
                let moveRow = 0;
                const lengthCsv = csv.length;
                let okMessages = "";
                let badMessages = "";

                for (let i = 0; i < lengthCsv; i++) {
                    const keys = Object.keys(csv[i + moveRow]);
                    for (let j = 0; j < keys.length; j++) {
                        let cleanKey = keys[j];
                        if (keys[j].indexOf(" ") > 0) {
                            cleanKey = keys[j].replace(/\s/g, "");
                            csv[i + moveRow][cleanKey] = csv[i + moveRow][keys[j]];
                            delete csv[i + moveRow][keys[j]];
                        }
                        if (this.allowedyKeys.indexOf(cleanKey) === -1) {
                            delete csv[i + moveRow][cleanKey];
                        } else if ((this.dateKeys.indexOf(cleanKey) !== -1) && (csv[i + moveRow][cleanKey] === "")) {
                            delete csv[i + moveRow][cleanKey];
                        }

                    }
                    const checkMsg = this.checkMessage(csv[i + moveRow]);
                    // check cvs ...
                    if (!checkMsg.result
                    ) {
                        badMessages = badMessages + (i + 1) + (checkMsg.errmsg ? "(" + checkMsg.errmsg + ")" : "") + ",";
                        csv.splice(i + moveRow, 1);
                        moveRow = moveRow - 1;
                    } else {
                        if ((!csv[i + moveRow]["BookingType"]) || (csv[i + moveRow]["BookingType"] === null)) {
                            csv[i + moveRow]["BookingType"] = "RegularBooking";
                        }

                        okMessages = okMessages + (i + 1) + ",";
                        csv[i + moveRow]["rowId"] = `row${i}`;
                        csv[i + moveRow]["OrderPackage"] = OrderPackage.Basket;
                    }
                }

                if (badMessages !== "") {
                    this.toasterService.pop("error", "Import error", "Rows num." + badMessages.slice(0, -1) + " is incomplete", true);
                }
                if (okMessages !== "") {
                    this.toasterService.pop("info", "Import ok", "Rows num." + okMessages.slice(0, -1) + " is imported", true);
                }
                if (csv.length > 0) {
                    this.orders = csv;
                    this.reloadData();
                }
            });
        };
        fileReader.readAsText(file);
    }

    reloadData() {
        this.reloadDataNotify.next();
    }

    public getSelected() {
        return [...this.selected];
    }

    public getOrders() {
        return [...this.orders];
    }

    public clearImports() {
        this.orders = [];
        this.selected = [];
    }

    public addSelectedImport(selected) {
        this.selected.push(selected);
    }

    public setSelected(selected) {
        this.selected = [...selected];
    }

    public UpdateSelectedImport(selected) {
        for (let i = 0; i < this.selected.length; i++) {
            if (this.selected[i].rowId === selected.rowId) {
                this.selected[i] = selected;
                break;
            }
        }
    }

    public RemoveSelectedImport(selected) {
        for (let i = 0; i < this.selected.length; i++) {
            if (this.selected[i].rowId === selected.rowId) {
                this.selected.splice(i, 1);
                break;
            }
        }
    }

    public RemoveImport(order) {
        this.RemoveSelectedImport(order);

        for (let i = 0; i < this.orders.length; i++) {
            if (this.orders[i].rowId === order.rowId) {
                this.orders.splice(i, 1);
            }
        }

    }

}
