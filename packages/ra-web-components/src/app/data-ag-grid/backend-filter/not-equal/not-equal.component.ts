import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FunctionOperator } from "../../../store-querying/operators/function-operator";
import { OperatorComponent } from "../operator-component.interface";

@Component({
    selector: "ra-not-equal",
    templateUrl: "./not-equal.component.html",
    styleUrls: ["./not-equal.component.less"]
})
export class NotEqualComponent implements OperatorComponent<FunctionOperator> {

    @Input() column: string;
    @Output() output: EventEmitter<FunctionOperator> = new EventEmitter<FunctionOperator>();

}
