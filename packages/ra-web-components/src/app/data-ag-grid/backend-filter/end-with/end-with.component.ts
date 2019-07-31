import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FunctionOperator } from "../../../store-querying/operators/function-operator";
import { OperatorComponent } from "../operator-component.interface";

@Component({
    selector: "ra-end-with",
    templateUrl: "./end-with.component.html",
    styleUrls: ["./end-with.component.less"]
})
export class EndWithComponent implements OperatorComponent<FunctionOperator> {

    @Input() column: string;
    @Output() output: EventEmitter<FunctionOperator> = new EventEmitter<FunctionOperator>();

}
