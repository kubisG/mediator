import { Component, Input, Output, EventEmitter } from "@angular/core";
import { OperatorComponent } from "../operator.component";
import { BetweenOperator } from "../../../store-querying/operators/between-operator";
import { OperandProperty } from "../../../store-querying/operators/operand-property";
import { OperandValue } from "../../../store-querying/operators/operand-value";

@Component({
    selector: "ra-between",
    templateUrl: "./between.component.html",
    styleUrls: ["./between.component.less"]
})
export class BetweenComponent extends OperatorComponent<BetweenOperator, void> {

    operator = new BetweenOperator();

    set valueFrom(value: string) {
        this.operator.testExpression = new OperandProperty(this.column);
        this.operator.beginExpression = new OperandValue(value);
        this.output.emit(this.operator);
    }

    set valueTo(value: string) {
        this.operator.testExpression = new OperandProperty(this.column);
        this.operator.endExpression = new OperandValue(value);
        this.output.emit(this.operator);
    }

}
