import { Input, Component, Output, EventEmitter } from "@angular/core";
import { SpecType } from "@ra/web-shared-fe";


@Component({
    selector: "ra-row-icons",
    templateUrl: "./row-icons.component.html",
    styleUrls: ["./row-icons.component.less"],
})
export class RowIconsComponent {
    public params: any;
    public specType = SpecType;

    public currentValue = 0;

    agInit(params: any): void {
        console.log("icons init", params);
        this.params = params;
    }

    refresh(params): boolean {
        this.params = params;
        return true;
    }
}
