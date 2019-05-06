import { Pipe, PipeTransform, Inject, LOCALE_ID } from "@angular/core";
import { formatDate } from "@angular/common";


@Pipe({
    name: "rangeDate"
})
export class RangeDatePipe implements PipeTransform {

    constructor(@Inject(LOCALE_ID) private locale: string) {
    }

    transform(rangeDates: any, args?: any): any {
        if (rangeDates) {
            const range = rangeDates.map(d => formatDate(d, "yyyy-MM-dd HH:mm", this.locale));
            return range[0] + " - " + range[1];
        } else {
            return null;
        }
    }
}
