import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FunctionOperator } from "../../../store-querying/operators/function-operator";
import { OperatorComponent } from "../operator-component.interface";

@Component({
    selector: "ra-equal",
    templateUrl: "./equal.component.html",
    styleUrls: ["./equal.component.less"]
})
export class EqualComponent implements OperatorComponent<FunctionOperator> {

    @Input() column: string;
    @Output() output: EventEmitter<FunctionOperator> = new EventEmitter<FunctionOperator>();

}
