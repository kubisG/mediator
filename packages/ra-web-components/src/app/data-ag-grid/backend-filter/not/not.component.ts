import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FunctionOperator } from "../../../store-querying/operators/function-operator";
import { OperatorComponent } from "../operator-component.interface";

@Component({
    selector: "ra-not",
    templateUrl: "./not.component.html",
    styleUrls: ["./not.component.less"]
})
export class NotComponent implements OperatorComponent<FunctionOperator> {

    @Input() column: string;
    @Output() output: EventEmitter<FunctionOperator> = new EventEmitter<FunctionOperator>();

}
