import { Injectable } from "@angular/core";
import { OrderStatus } from "../orders/order-status";
import { Side } from "@ra/web-shared-fe";

@Injectable()
export class OrderStatusService {

    canAccept(order) {
        return [
            OrderStatus.PendingCancel,
            OrderStatus.PendingReplace,
            OrderStatus.PendingNew
        ].indexOf(order.OrdStatus) > -1;
    }

    canReject(order) {
        return [
            OrderStatus.PendingCancel,
            OrderStatus.PendingReplace,
            OrderStatus.PendingNew
        ].indexOf(order.OrdStatus) > -1;
    }

    canBulkReject(order) {
        return [
            OrderStatus.PendingNew
        ].indexOf(order.OrdStatus) > -1;
    }

    canCancel(order) {
        return [
//            OrderStatus.PendingNew,
//            OrderStatus.PendingReplace,
            OrderStatus.New,
            OrderStatus.PartiallyFilled,
            OrderStatus.Filled,
            OrderStatus.Replaced,
            OrderStatus.DoneForDay
        ].indexOf(order.OrdStatus) > -1;
    }

    canReplace(order) {
        return [
//            OrderStatus.PendingNew,
//            OrderStatus.PendingReplace,
            OrderStatus.New,
            OrderStatus.PartiallyFilled,
            OrderStatus.Filled,
            OrderStatus.Replaced,
        ].indexOf(order.OrdStatus) > -1;
    }

    canBust(order) {
        return [
            OrderStatus.DoneForDay,
        ].indexOf(order.OrdStatus) > -1;
    }

    canFill(order) {
        return [
            OrderStatus.PendingCancel,
            OrderStatus.PendingReplace,
            OrderStatus.New,
            OrderStatus.PendingNew,
            OrderStatus.PartiallyFilled,
            OrderStatus.Filled,
            OrderStatus.Replaced
        ].indexOf(order.OrdStatus) > -1;
    }

    canDFD(order) {
        return [
            OrderStatus.PendingCancel,
            OrderStatus.PendingReplace,
            OrderStatus.New,
            OrderStatus.PartiallyFilled,
            OrderStatus.Filled,
            OrderStatus.Replaced
        ].indexOf(order.OrdStatus) > -1;
    }

    canSplit(order, checkFilled: boolean) {
        return ((([Side.Buy, Side.Sell].indexOf(order.Side) > -1 ) && ([
            OrderStatus.New,
            OrderStatus.Replaced,
            OrderStatus.PartiallyFilled
        ].indexOf(order.OrdStatus) > -1)) || (
                checkFilled && ([
                    OrderStatus.Filled,
                    OrderStatus.PendingCancel,
                    OrderStatus.PendingReplace,
                    OrderStatus.DoneForDay,
                ].indexOf(order.OrdStatus) > -1)
            ))
            ;
    }

}
