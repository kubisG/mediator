import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "enumValue"
})

export class EnumValuePipe implements PipeTransform {
    transform(myitem: any, lookups: any): any {
        if (!myitem) {
            return "";
        }

        if (!lookups) {
            return myitem;
        }

        for (const itemid in lookups) {
            if (itemid) {
                if (lookups[itemid]["value"] === myitem) {
                    return lookups[itemid]["name"];
                }
            }
        }

        return lookups[myitem];
    }
}
