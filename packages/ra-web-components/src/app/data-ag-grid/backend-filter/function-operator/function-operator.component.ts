import { OperatorComponent } from "../operator.component";
import { FunctionOperator } from "../../../store-querying/operators/function-operator";
import { FunctionOperatorType } from "../../../store-querying/operators/function-operator-type.enum";
import { Component } from "@angular/core";
import { OperandProperty } from "../../../store-querying/operators/operand-property";
import { OperandValue } from "../../../store-querying/operators/operand-value";

@Component({
    selector: "ra-function-operator",
    templateUrl: "./function-operator.component.html",
    styleUrls: ["./function-operator.component.less"]
})
export class FunctionOperatorComponent extends OperatorComponent<FunctionOperator, FunctionOperatorType> {

    operator = new FunctionOperator();

    set value(value: string) {
        this.operator.operatorType = this.type;
        this.operator.operands = [new OperandProperty(this.column), new OperandValue(value)];
        this.output.emit(this.operator);
    }

}
