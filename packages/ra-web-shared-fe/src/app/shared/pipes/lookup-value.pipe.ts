import { Pipe, PipeTransform, Inject, LOCALE_ID } from "@angular/core";
import { formatDate } from "@angular/common";
import { environment } from "../../../environments/environment";
import { TypesArray } from "../types-array";

@Pipe({
  name: "lookupValue"
})

/**
 * Transform value to name from lookups
 */
export class LookupValuePipe implements PipeTransform {


  constructor(@Inject(LOCALE_ID) private locale: string) { }

  transform(myitem: any, lookups: any, precision: number = 4): any {
    if (!myitem) {
      return "";
    }

    if ((!lookups) || (!lookups[myitem["key"]])) {
      if (TypesArray.numVals.indexOf(myitem["key"]) > -1) {
        return Number(myitem["value"]).toFixed(precision);
      } else if (TypesArray.dateVals.indexOf(myitem["key"]) > -1) {
        return formatDate(myitem["value"], "yyyy-MM-dd HH:mm:ss", this.locale);
      } else {
        return myitem["value"];
      }
    }

    for (const itemid in lookups[myitem["key"]]) {
      if (itemid) {
        if (lookups[myitem["key"]][itemid]["value"] === myitem["value"]) {
          return lookups[myitem["key"]][itemid]["name"];
        }
      }
    }
    return myitem["value"];
  }
}
