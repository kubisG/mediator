import "reflect-metadata";
import { Injectable, Inject, LOCALE_ID } from "@angular/core";
import { ExecType } from "@ra/web-shared-fe";
import { LightMapper } from "light-mapper";
import { AcceptNew } from "./messages/accept-new";
import { MessageType } from "@ra/web-shared-fe";
import { OrdStatus } from "@ra/web-shared-fe";
import { OrderPackage } from "@ra/web-shared-fe";
import { Store } from "@ngxs/store";
import { AuthState } from "../core/authentication/state/auth.state";
import { AuthStateModel } from "../core/authentication/state/auth.model";
import { Reject } from "./messages/reject";
import { Execution } from "./messages/execution";
import { DoneForDay } from "./messages/done-for-day";
import { Fill } from "./messages/fill";
import { ExecTransType } from "@ra/web-shared-fe";
import { OrderNew } from "./messages/order-new";
import { UIDService } from "../core/uid.service";
import { formatDate } from "@angular/common";

@Injectable()
export class MessageFactoryService {

    private allowedReplace = ["Placed", "TransactTime", "ClOrdID", "CumQty", "AvgPx", "LastPx", "LastQty", "LeavesQty"];

    constructor(
        @Inject(LOCALE_ID) private locale: string,
        private store: Store,
        private uIDService: UIDService,
    ) { }

    private getFillExecType(orderQty: number, filledQty: number) {
        if (filledQty < orderQty) {
            return ExecType.PartialFill;
        }
        return ExecType.Fill;
    }

    private getFillOrderStatus(orderQty: number, filledQty: number) {
        if (filledQty < orderQty) {
            return OrdStatus.PartiallyFilled;
        }
        return OrdStatus.Filled;
    }

    private getMapper(): LightMapper {
        return new LightMapper();
    }

    private getAcceptOrdStatus(message: any) {
        switch (message.OrdStatus) {
            case OrdStatus.PendingCancel: {
                return OrdStatus.Canceled;
            }
            case OrdStatus.PendingNew: {
                return OrdStatus.New;
            }
            case OrdStatus.PendingReplace: {
                return message.OrdStatus;
            }
            default: {
                // TODO : throw exception
                return message.OrdStatus;
            }
        }
    }

    private getAcceptExecType(message: any) {
        switch (message.OrdStatus) {
            case OrdStatus.PendingCancel: {
                return ExecType.Canceled;
            }
            case OrdStatus.PendingNew: {
                return ExecType.New;
            }
            case OrdStatus.PendingReplace: {
                return ExecType.Replace;
            }
            default: {
                // TODO : throw exception
                return message.ExecType;
            }
        }
    }

    private attachToRoot(message: any) {
        if (message.OrigClOrdID) {
            message.ClOrdID = message.OrigClOrdID;
            message.OrigClOrdID = null;
        }
    }

    public getUniqueID() {
        return `${this.uIDService.nextInt()}`;
    }

    public setCancelFillValues(msg: any, messages: any[], index: number) {
        let fillsCnt = 0;
        const newValues = { CumQty: 0, LeavesQty: 0, AvgPx: 0, OrderQty: 0 };
        for (let i = 0; i < messages.length; i++) {
            if (messages[i].OrdStatus.indexOf("Fill") > -1 && i !== index && messages[i].Canceled !== "Y" && messages[i].LastQty > 0) {
                newValues.CumQty += Number(messages[i].LastQty);
                newValues.AvgPx += Number(messages[i].LastPx);
                fillsCnt++;
            }
            if (messages[i].OrdStatus.indexOf("Fill") > -1 && i !== index && messages[i].Canceled !== "Y") {
                newValues.OrderQty = Number(messages[i].OrderQty);
            }
        }
        newValues.LeavesQty = Number(newValues.OrderQty) - Number(newValues.CumQty);
        msg.CumQty = Number(newValues.CumQty);
        msg.LeavesQty = Number(newValues.LeavesQty);
        msg.AvgPx = Number((newValues.AvgPx / fillsCnt));
        msg.OrdStatus = msg.CumQty === 0 ? OrdStatus.New : OrdStatus.PartiallyFilled;
        msg.OrderQty = newValues.OrderQty;
        msg.LastQty = 0;
        msg.LastPx = 0;
    }

    public cancelFill(message: any, prevMsg: any) {
        const user: AuthStateModel = this.store.selectSnapshot(AuthState.getUser);
        const target = message.OnBehalfOfCompID; // SenderCompID
        const mapper: LightMapper = this.getMapper();
        const cancel = mapper.map<Execution>(Execution, message);
        cancel.msgType = MessageType.Execution;
        cancel.RequestType = "Broker";
        cancel.ExecType = ExecType.TradeCancel;
        cancel.SenderCompID = user.compQueueBroker;
        cancel.TargetCompID = target;
        cancel.TransactTime = new Date().toISOString();
        (cancel as any).ExecRefID = cancel.ExecID;
        cancel.ExecID = `EX${this.uIDService.nextInt()}`;
        // this.setCancelFillValues(cancel, messages, index);
        return cancel;
    }

    public cancel(message: any) {
        const user: AuthStateModel = this.store.selectSnapshot(AuthState.getUser);
        const target = message.DeliverToCompID; // SenderCompID
        const mapper: LightMapper = this.getMapper();
        const cancel = mapper.map<Execution>(Execution, message);
        cancel.ExecTransType = ExecTransType.New;
        cancel.RequestType = "Broker";
        cancel.LeavesQty = 0;
        cancel.ExecType = ExecType.Canceled;
        cancel.ExecID = `EX${this.uIDService.nextInt()}`;
        cancel.OrdStatus = OrdStatus.Canceled;
        cancel.SenderCompID = user.compQueueBroker;
        cancel.TargetCompID = target;
        cancel.TransactTime = new Date().toISOString();
        return cancel;
    }

    public dfd(message: any, commission?: any) {
        const user: AuthStateModel = this.store.selectSnapshot(AuthState.getUser);
        const mapper = new LightMapper();
        const sender = message.OnBehalfOfCompID; // SenderCompID
        const result = mapper
            .map<DoneForDay>(DoneForDay, message);
        result.RequestType = "Broker";
        result.ExecType = ExecType.DoneForDay;
        result.OrdStatus = OrdStatus.DoneForDay;
        result.TargetCompID = sender;
        result.msgType = MessageType.Execution;
        result.ExecTransType = ExecTransType.New;
        result.ExecID = `EX${this.uIDService.nextInt()}`;
        // result.company = user.compId;
        result.SenderCompID = user.compQueueBroker;
        result.TransactTime = new Date().toISOString();
        if (commission) {
            result.CommType = commission.CommType;
            result.Commission = Number(commission.Commission);
        }
        return result;
    }

    public fill(message: any, formData: any) {
        const user: AuthStateModel = this.store.selectSnapshot(AuthState.getUser);
        const mapper = new LightMapper();
        const sender = message.OnBehalfOfCompID; // SenderCompID
        const result = mapper
            .map<Fill>(Fill, message);
        result.RequestType = "Broker";
        result.CumQty = Number(result.CumQty ? result.CumQty : 0) + Number(formData.qtyForFill);
        result.LeavesQty = message.OrderQty - result.CumQty;
        result.LastPx = Number(formData.pxForFill);
        result.LastQty = Number(formData.qtyForFill);
        result.LastMkt = formData.LastMkt;
        result.LastCapacity = formData.LastCapacity;
        result.LastLiquidityInd = formData.LastLiquidityInd;
        result.ExecID = `EX${this.uIDService.nextInt()}`;
        result.ExecTransType = ExecTransType.New;
        result.ExecType = this.getFillExecType(Number(message.OrderQty),
            result.CumQty);
        result.OrdStatus = this.getFillOrderStatus(
            Number(message.OrderQty),
            result.CumQty
        );
        result.TargetCompID = sender;
        result.msgType = MessageType.Execution;
        result.SenderCompID = user.compQueueBroker;
        result.TransactTime = new Date().toISOString();
        this.attachToRoot(result);
        return result;
    }

    public reject(message: any) {
        const user: AuthStateModel = this.store.selectSnapshot(AuthState.getUser);
        const mapper = new LightMapper();
        const sender = message.OnBehalfOfCompID; // SenderCompID
        const result = mapper
            .map<Reject>(Reject, message);

        result.RequestType = "Broker";
        result.OrdStatus = OrdStatus.Rejected;
        result.SenderCompID = user.compQueueBroker;
        result.TargetCompID = sender;
        result.msgType = MessageType.OrderCancelReject;
        result.TransactTime = new Date().toISOString();
        return result;
    }

    public accept(message: any) {
        const user: AuthStateModel = this.store.selectSnapshot(AuthState.getUser);
        const mapper = new LightMapper();
        const target = message.OnBehalfOfCompID; // SenderCompID

        let result = <AcceptNew>null;
        if (message.OrdStatus === OrdStatus.PendingReplace) {
            result = mapper
                .map<AcceptNew>(AcceptNew, message.replaceMessage);
            result.LastQty = 0;
            result.LastPx = 0;
            result.LeavesQty = result.LeavesQty ? result.LeavesQty : result.OrderQty;
        } else if (message.OrdStatus === OrdStatus.PendingCancel) {
            result = mapper
                .map<AcceptNew>(AcceptNew, message);
            result.LastQty = 0;
            result.LastPx = 0;
            result.LeavesQty = 0;
        } else {
            result = mapper
                .map<AcceptNew>(AcceptNew, message);
            result.AvgPx = 0;
            result.CumQty = 0;
            result.LastQty = 0;
            result.LastPx = 0;
            result.LeavesQty = result.LeavesQty ? result.LeavesQty : result.OrderQty;
        }
        result.msgType = MessageType.Execution;
        result.SecurityType = message.SecurityType ? message.SecurityType : "CS";
        result.RequestType = "Broker";
        result.SenderCompID = user.compQueueBroker;
        result.TargetCompID = target;
        result.TransactTime = new Date().toISOString();
        result.OrdStatus = this.getAcceptOrdStatus(message);
        result.OrderID = result.OrderID && result.OrderID !== null ? result.OrderID : `ORD${this.uIDService.nextInt()}`;
        result.ExecID = `EX${this.uIDService.nextInt()}`;
        result.ExecType = this.getAcceptExecType(message);
        result.ExecTransType = ExecTransType.New;

        if (result.OrdStatus === OrdStatus.Canceled) {
            result.LeavesQty = 0;
        }
        result.company = user.compId;
        return result;
    }

    public order(message: any) {
        const user: AuthStateModel = this.store.selectSnapshot(AuthState.getUser);

        message.RequestType = "Trader";
        message.TransactTime = new Date().toISOString();
        message.ExecType = null;
        message.ExecTransType = null;

        message.company = user.compId;
        message.user = user.id;
        message.SenderCompID = user.compQueueTrader;
        message.OnBehalfOfCompID = user.compQueueTrader;
        message.DeliverToCompID = message.TargetCompID;
        message.compQueue = user.compQueueTrader;
        message.userId = user.id;
        message.ClientID = message.ClientID && message.ClientID !== null ? message.ClientID : user.ClientID;
        return message;
    }

    public newOrder(message: any) {
        message = this.order(message);
        message.msgType = MessageType.Order;
        message.OrdStatus = OrdStatus.PendingNew;
        message.OrderPackage = OrderPackage.Single;
        message.createDate = new Date().toISOString();
        message.updateDate = new Date().toISOString();
        // message.Placed = new Date().toISOString();
        message.TransactTime = new Date().toISOString();
        return message;
    }

    public replaceOrder(message: any) {
        const user: AuthStateModel = this.store.selectSnapshot(AuthState.getUser);
        const target = message.DeliverToCompID; // SenderCompID

        message = this.order(message);
        message.createDate = new Date().toISOString();
        message.updateDate = new Date().toISOString();
        if (message.replaceMessage && message.replaceMessage.ClOrdID) {
            message.OrigClOrdID = message.replaceMessage.ClOrdID;
        } else {
            message.OrigClOrdID = message.ClOrdID;
        }
        // message.Placed = message.Placed ? message.Placed : new Date().toISOString();
        message.OrdStatus = OrdStatus.PendingReplace;
        message.msgType = MessageType.Replace;
        message.OrderQty = message.NewOrderQty;
        message.ClOrdID = null;
        message.ExecType = ExecType.PendingReplace;
        message.NewOrderQty = null;
        message.TransactTime = new Date().toISOString();
        message.SenderCompID = user.compQueueTrader;
        message.TargetCompID = target;
        message.OnBehalfOfCompID = user.compQueueTrader;
        message.DeliverToCompID = message.TargetCompID;
        return message;
    }

    public cancelOrder(message: any) {
        const user: AuthStateModel = this.store.selectSnapshot(AuthState.getUser);
        const target = message.DeliverToCompID; // SenderCompID

        message = this.order(message);
        message.OrigClOrdID = message.ClOrdID;
        message.ClOrdID = null;
        message.msgType = MessageType.Cancel;
        message.OrdStatus = OrdStatus.PendingCancel;
        message.TransactTime = new Date().toISOString();
        message.SenderCompID = user.compQueueTrader;
        message.TargetCompID = target;
        message.OnBehalfOfCompID = user.compQueueTrader;
        message.DeliverToCompID = message.TargetCompID;
        message.ExecType = ExecType.PendingCancel;

        return message;
    }

    public cleanOrder(message: any) {
        const mapper = new LightMapper();

        const result = mapper
            .map<OrderNew>(OrderNew, message);

        return result;
    }


    public calculateDisplayValue(values, columnDef) {
        const data = values.data ? values.data : values;
        const dtField = columnDef.dataField;
        if ((this.allowedReplace.indexOf(dtField) === -1) && (data.OrdStatus === OrdStatus.PendingReplace)) {
            if (data["replaceMessage"] &&
                (data["replaceMessage"][dtField] ?
                    data["replaceMessage"][dtField] : null) !== (data[dtField] ?
                        data[dtField] : null)) {

                switch (columnDef.dataType) {
                    case "number": {
                        if (columnDef.format && columnDef.format.precision) {
                            return (data[dtField] && data[dtField] !== null ?
                                Number(data[dtField]).toFixed(columnDef.format.precision) : "None") + " ( " +
                                (data["replaceMessage"][dtField] && data["replaceMessage"][dtField] !== null
                                    ? data["replaceMessage"][dtField] : "None") + " )";
                        } else {
                            return (data[dtField] && data[dtField] !== null ? data[dtField] : "None") + " ( " +
                                (data["replaceMessage"][dtField] && data["replaceMessage"][dtField] !== null
                                    ? data["replaceMessage"][dtField] : "None") + " )";
                        }
                    }
                    case "date": {
                        return (data[dtField] && data[dtField] !== null ?
                            formatDate(data[dtField], columnDef.format, this.locale) : "None") + " ( " +
                            (data["replaceMessage"][dtField] && data["replaceMessage"][dtField] !== null
                                ? formatDate(data["replaceMessage"][dtField], columnDef.format, this.locale) : "None") + " )";
                    }
                    default: {
                        return (data[dtField] && data[dtField] !== null ? data[dtField] : "None") + " ( " +
                            (data["replaceMessage"][dtField] && data["replaceMessage"][dtField] !== null
                                ? data["replaceMessage"][dtField] : "None") + " )";
                    }
                }
            }
        }

        if (!data[dtField] || data[dtField] === null) {
            if (columnDef.dataType === "number") {
                return Number("0").toLocaleString(undefined, {maximumFractionDigits:values.column.userProvidedColDef.format
                    ? values.column.userProvidedColDef.format.precision : (columnDef.format ? columnDef.format.precision : null)});
            }
            if (columnDef.dataType === "bool") {
                return "No";
            }
            return;
        }
        switch (columnDef.dataType) {
            case "number": {
                if (values.data) {
                    return Number(data[dtField]).toLocaleString(undefined, {maximumFractionDigits:values.column.userProvidedColDef.format
                        ? values.column.userProvidedColDef.format.precision : (columnDef.format ? columnDef.format.precision : null)});
                } else {
                    return Number(data[dtField]);
                }
            }
            case "date": {
                if (values.data) {
                    return formatDate(data[dtField],
                        values.column.userProvidedColDef.format ? values.column.userProvidedColDef.format : columnDef.format, this.locale);
                } else {
                    return new Date(data[dtField]);
                }
            }
            case "bool": {
                return data[dtField] ? "Yes" : "No";
            }
            case "lookup": {
                if ((columnDef.lookup) && (columnDef.lookup.dataSource)) {
                    const obj = columnDef.lookup.dataSource.find(o => o[columnDef.lookup["valueExpr"]] === data[dtField]);
                    if (obj) {
                        return obj[columnDef.lookup.displayExpr];
                    }
                }
                return data[dtField];
            }
            default: {
                return data[dtField];
            }
        }
    }
}
