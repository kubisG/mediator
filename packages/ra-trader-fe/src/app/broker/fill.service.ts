import { Injectable } from "@angular/core";
import { OrdType } from "@ra/web-shared-fe";
import { Side } from "@ra/web-shared-fe";

@Injectable()
export class FillService {

    /**
   * Checks that the distance from the new fill price is not more than 5% away from the previous fill.
   * Only in effect on Limit orders in any state, and Market orders that have a previous fill.
   *
   * @param {any} order
   * @param {any} field
   */
    distanceOk(order, field) {
        if (!field) {
            return true;
        }
        const price = parseFloat(field);
        if (order.OrdType === OrdType.Limit && (field !== undefined || field !== null)) {
            if (!(order.AvgPx > 0) && !(order.Price > 0)) { return true; }
            const comparisonPrice = Number(order.AvgPx > 0 ? order.AvgPx : order.Price);
            const high = comparisonPrice + (comparisonPrice * 0.05);
            const low = comparisonPrice - (comparisonPrice * 0.05);
            return (price <= high && price >= low) || field === undefined || field === null;
        } else if (order.OrdType === OrdType.Market && (field !== undefined || field !== null)) {
            if (!(order.AvgPx > 0)) { return true; }
            const comparisonPrice = Number(order.AvgPx);
            const high = comparisonPrice + (comparisonPrice * 0.05);
            const low = comparisonPrice - (comparisonPrice * 0.05);
            return (price <= high && price >= low) || field === undefined || field === null;
        } else {
            return true;
        }
    }

    /**
   * Checks if the price is on the correct side of the limit based on the order type
   *
   * @param {any} order
   * @param {any} field
   */
    sideOk(order, field) {
        if (!field) {
            return true;
        }
        const price = parseFloat(field);
        if (order.OrdType === OrdType.Limit && (field !== undefined || field !== null)
            && (order.Price !== undefined || order.Price !== null)) {
            if (order.Side === Side.Buy) { return price <= order.Price; }
            return price >= order.Price;
        } else if ((order.OrdType === OrdType.Market || order.OrdType === "MOC") && (field !== undefined || field !== null)) {
            return true;
        } else {
            return true;
        }
    }

}
