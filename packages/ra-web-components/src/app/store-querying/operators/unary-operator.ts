import { Operator } from "./operator.interface";
import { UnaryOperatorType } from "./unary-operator-type.enum";

export class UnaryOperator implements Operator {

    operands: Operator[];
    operand: Operator;
    operatorType: UnaryOperatorType;

}
