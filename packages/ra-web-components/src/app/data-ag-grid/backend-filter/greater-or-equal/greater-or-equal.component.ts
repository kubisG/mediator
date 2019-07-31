import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FunctionOperator } from "../../../store-querying/operators/function-operator";
import { OperatorComponent } from "../operator-component.interface";

@Component({
    selector: "ra-greater-or-equal",
    templateUrl: "./greater-or-equal.component.html",
    styleUrls: ["./greater-or-equal.component.less"]
})
export class GreateOrEqualComponent implements OperatorComponent<FunctionOperator> {

    @Input() column: string;
    @Output() output: EventEmitter<FunctionOperator> = new EventEmitter<FunctionOperator>();

}
