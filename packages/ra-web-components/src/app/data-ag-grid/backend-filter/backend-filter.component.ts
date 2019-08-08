import { Component, AfterViewInit } from "@angular/core";
import { IAfterGuiAttachedParams, IDoesFilterPassParams, IFilterParams, RowNode } from "ag-grid-community";
import { IFilterAngularComp } from "ag-grid-angular";
import { Operator } from "../../store-querying/operators/operator.interface";
import { FunctionOperatorType } from "../../store-querying/operators/function-operator-type.enum";
import { BinaryOperatorType } from "../../store-querying/operators/binary-operator-type.enum";
import { UnaryOperatorType } from "../../store-querying/operators/unary-operator-type.enum";
import { QueryBuilderService } from "../../store-querying/query-builder.service";
import { Subject } from "rxjs/internal/Subject";

@Component({
    selector: "ra-backend-filter",
    templateUrl: "./backend-filter.component.html",
    styleUrls: ["./backend-filter.component.less"]
})
export class BackendFilterComponent implements IFilterAngularComp {

    operators = [
        { name: "Start with", type: FunctionOperatorType.StartsWith },
        { name: "End with", type: FunctionOperatorType.EndsWith },
        { name: "Contains", type: FunctionOperatorType.Contains },
        { name: "In" },
        { name: "Not", type: UnaryOperatorType.Not },
        { name: "Between" },
        { name: "Equal", type: BinaryOperatorType.Equal },
        { name: "Greater", type: BinaryOperatorType.Greater },
        { name: "GreaterOrEqual", type: BinaryOperatorType.GreaterOrEqual },
        { name: "Less", type: BinaryOperatorType.Less },
        { name: "LessOrEqual", type: BinaryOperatorType.LessOrEqual },
        { name: "NotEqual", type: BinaryOperatorType.NotEqual },
    ];

    params: IFilterParams;
    selected = this.operators[0];
    columnName: string;
    outOperator: Subject<{ operator: Operator, column: string }> = new Subject<{ operator: Operator, column: string }>();

    constructor(
        private queryBuilderService: QueryBuilderService,
    ) { }

    onOutput(operator: Operator) {
        this.outOperator.next({ operator, column: this.columnName });
    }

    onChange(name: string) {
        this.selected = { name };
    }

    isFilterActive(): boolean {
        return false;
    }

    doesFilterPass(params: IDoesFilterPassParams): boolean {
        return false;
    }

    getModel() {

    }

    setModel(model: any): void {

    }

    agInit(params: IFilterParams): void {
        this.params = params;
        this.columnName = params.colDef.field;
    }

}
