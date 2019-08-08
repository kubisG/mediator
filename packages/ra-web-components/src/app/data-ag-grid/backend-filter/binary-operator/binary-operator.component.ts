import { OperatorComponent } from "../operator.component";
import { BinaryOperator } from "../../../store-querying/operators/binary-operator";
import { BinaryOperatorType } from "../../../store-querying/operators/binary-operator-type.enum";
import { Component } from "@angular/core";
import { OperandProperty } from "../../../store-querying/operators/operand-property";
import { OperandValue } from "../../../store-querying/operators/operand-value";

@Component({
    selector: "ra-binary-operator",
    templateUrl: "./binary-operator.component.html",
    styleUrls: ["./binary-operator.component.less"]
})
export class BinaryOperatorComponent extends OperatorComponent<BinaryOperator, BinaryOperatorType> {

    operator = new BinaryOperator();

    set value(value: string) {
        this.operator.operatorType = this.type;
        this.operator.operands = [new OperandProperty(this.column), new OperandValue(value)];
        console.log("this.operator", this.operator);
        this.output.emit(this.operator);
    }

}
