import { Component, OnInit } from "@angular/core";
import { OperatorComponent } from "../operator.component";
import { InOperator } from "../../../store-querying/operators/in-operator";
import { OperandProperty } from "../../../store-querying/operators/operand-property";
import { OperandValue } from "../../../store-querying/operators/operand-value";
import { RowNode } from "ag-grid-community";
import { ClearOperator } from "../../../store-querying/operators/clear-operator";

@Component({
    selector: "ra-in",
    templateUrl: "./in.component.html",
    styleUrls: ["./in.component.less"]
})
export class InComponent extends OperatorComponent<InOperator, void> implements OnInit {

    operator = new InOperator();
    distinctValues = [];
    values = [];

    checkboxClick(value: any) {
        const valueIndex = this.values.indexOf(value);
        if (valueIndex === -1) {
            this.values.push(value);
        } else {
            this.values.splice(valueIndex, 1);
        }
        const operators = [];
        if (this.values.length === 0) {
            this.output.emit(new ClearOperator());
            return;
        }
        for (const val of this.values) {
            operators.push(new OperandValue(val));
        }
        this.operator.operands = operators;
        this.operator.leftOperand = new OperandProperty(this.column);
        this.output.emit(this.operator);
    }

    ngOnInit(): void {
        this.params.api.forEachNode((rowNode: RowNode, index: number) => {
            if (this.distinctValues.indexOf(rowNode.data[this.column]) === -1) {
                this.distinctValues.push(rowNode.data[this.column]);
            }
        });
    }

}
