
import { Pipe, PipeTransform } from "@angular/core";
import { environment } from "../../../environments/environment";

@Pipe({
  name: "formatBalance", pure: true
})
export class FormatBalancePipe implements PipeTransform {
  transform(value: any, type: string, precision: number = 4): any {
    if (value) {
      if (type === "current") {
        return Number(value.allBalance).toLocaleString(undefined, { minimumFractionDigits: precision });
      } else if (type === "open") {
        return Number(value.allOpenBalance).toLocaleString(undefined, { minimumFractionDigits: precision });
      } else if (type === "opentool") {
        const balance = JSON.stringify(value.openBalance);
        if (balance) {
          return balance.slice(1, -1);
        } else {
          return Number(value).toLocaleString(undefined, { minimumFractionDigits: precision });
        }
      } else if (type === "currenttool") {
        const balance = JSON.stringify(value.currentBalance);
        if (balance) {
          return balance.slice(1, -1);
        } else {
          return Number(value).toLocaleString(undefined, { minimumFractionDigits: precision });
        }
      } else {
        return Number(value).toLocaleString(undefined, { minimumFractionDigits: precision });
      }
    } else {
      return Number(value).toLocaleString(undefined, { minimumFractionDigits: precision });
    }
  }
}
