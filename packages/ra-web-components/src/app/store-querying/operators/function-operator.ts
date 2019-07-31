import { Operator } from "./operator.interface";
import { FunctionOperatorType } from "./function-operator-type.enum";

export class FunctionOperator implements Operator {

    operands: Operator[];
    operatorType: FunctionOperatorType;

}
