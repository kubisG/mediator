import { Input, Output, EventEmitter } from "@angular/core";
import { IFilterParams } from "ag-grid-community";
import { Operator } from "../../store-querying/operators/operator.interface";

export class OperatorComponent<T, S> {

    @Input() column: string;
    @Input() type: S;
    @Input() params: IFilterParams;

    @Output() output: EventEmitter<Operator> = new EventEmitter<Operator>();

}
