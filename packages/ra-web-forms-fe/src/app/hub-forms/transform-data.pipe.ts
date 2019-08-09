import { Pipe, PipeTransform, Inject, LOCALE_ID } from "@angular/core";
import { formatDate } from "@angular/common";

@Pipe({
    name: "transformData"
})

/**
 * Transform value to name from lookups
 */
export class TransformDataPipe implements PipeTransform {


    constructor(@Inject(LOCALE_ID) private locale: string) { }

    transform(myitem: any, lookups: any): any {
        if (!myitem) {
            return "";
        }
        if (!lookups) {
            return myitem["value"];
        } else {
            const obj = lookups.filter(item => item.key === myitem["key"])[0];

            if (!obj) {
                return myitem["value"];
            }
            if ((obj.type === "input") && (obj.templateOptions) && (obj.templateOptions.type === "number")) {
                return Number(myitem["value"]).toFixed(obj.templateOptions.decimalLimit);
            } else if (obj.type === "datepicker") {
                return formatDate(myitem["value"], "yyyy-MM-dd HH:mm:ss", this.locale);
            } else if ((obj.type === "select") && (obj.templateOptions)) {
                for (let i = 0; i < obj.templateOptions.options.length; i++) {
                    if (obj.templateOptions.options[i]["value"] === myitem["value"]) {
                        return obj.templateOptions.options[i]["label"];
                    }
                }
                return myitem["value"];
            } else {
                return myitem["value"];
            }

        }
    }
}
