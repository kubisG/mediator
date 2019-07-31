import { Component, Output, EventEmitter, Input } from "@angular/core";
import { FunctionOperator } from "../../../store-querying/operators/function-operator";
import { FunctionOperatorType } from "../../../store-querying/operators/function-operator-type.enum";
import { OperandProperty } from "../../../store-querying/operators/operand-property";
import { OperandValue } from "../../../store-querying/operators/operand-value";
import { OperatorComponent } from "../operator-component.interface";

@Component({
    selector: "ra-start-with",
    templateUrl: "./start-with.component.html",
    styleUrls: ["./start-with.component.less"]
})
export class StartWithComponent implements OperatorComponent<FunctionOperator> {

    operator = new FunctionOperator();

    @Input() column: string;
    @Output() output: EventEmitter<FunctionOperator> = new EventEmitter<FunctionOperator>();

    constructor() {
        this.operator.operatorType = FunctionOperatorType.StartsWith;
    }

    set value(value: string) {
        this.operator.operands = [new OperandProperty(this.column), new OperandValue(value)];
        this.output.emit(this.operator);
    }

}
