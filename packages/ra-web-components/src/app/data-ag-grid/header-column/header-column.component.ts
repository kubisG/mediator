import { Component, ChangeDetectionStrategy } from "@angular/core";
import { IHeaderGroupAngularComp } from "ag-grid-angular";
import { IAfterGuiAttachedParams, IHeaderGroupParams } from "ag-grid-community";

@Component({
    selector: "ra-data-ag-grid-header-column",
    templateUrl: "./header-column.component.html",
    styleUrls: ["./header-column.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderColumnComponent implements IHeaderGroupAngularComp {
    public params;

    agInit(params: IHeaderGroupParams): void {
        console.log(params);
        this.params = params;
    }

    afterGuiAttached?(params?: IAfterGuiAttachedParams): void {

    }

}
