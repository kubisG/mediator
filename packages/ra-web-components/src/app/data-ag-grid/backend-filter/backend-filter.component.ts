import { Component, AfterViewInit } from "@angular/core";
import { IAfterGuiAttachedParams, IDoesFilterPassParams, IFilterParams, RowNode } from "ag-grid-community";
import { IFilterAngularComp } from "ag-grid-angular";
import { Operator } from "../../store-querying/operators/operator.interface";

@Component({
    selector: "ra-backend-filter",
    templateUrl: "./backend-filter.component.html",
    styleUrls: ["./backend-filter.component.less"]
})
export class BackendFilterComponent implements IFilterAngularComp {

    operators = [
        { name: "Start with" },
        { name: "End with" },
        { name: "Contains" },
        { name: "In" },
        { name: "Not" },
        { name: "Between" },
        { name: "Equal" },
        { name: "Greater" },
        { name: "GreaterOrEqual" },
        { name: "Less" },
        { name: "LessOrEqual" },
        { name: "NotEqual" },
    ];

    selected = this.operators[0];
    columnName: string;

    onOutput(operator: Operator) {
        console.log(operator);
    }

    onChange(name: string) {
        this.selected = { name };
    }

    isFilterActive(): boolean {
        return false;
    }

    doesFilterPass(params: IDoesFilterPassParams): boolean {
        console.log(params);
        return false;
    }

    getModel() {

    }

    setModel(model: any): void {

    }

    agInit(params: IFilterParams): void {
        this.columnName = params.colDef.field;
    }

}
