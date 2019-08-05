import { OperatorComponent } from "../operator.component";
import { UnaryOperator } from "../../../store-querying/operators/unary-operator";
import { UnaryOperatorType } from "../../../store-querying/operators/unary-operator-type.enum";
import { Component, OnInit } from "@angular/core";
import { OperandProperty } from "../../../store-querying/operators/operand-property";

@Component({
    selector: "ra-unary-operator",
    templateUrl: "./unary-operator.component.html",
    styleUrls: ["./unary-operator.component.less"]
})
export class UnaryOperatorComponent extends OperatorComponent<UnaryOperator, UnaryOperatorType> implements OnInit {

    operator = new UnaryOperator();

    ngOnInit(): void {
        this.operator.operatorType = this.type;
        this.operator.operand = new OperandProperty(this.column);
        this.output.emit(this.operator);
    }

}
