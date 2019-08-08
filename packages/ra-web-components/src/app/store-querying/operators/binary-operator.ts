import { Operator } from "./operator.interface";
import { BinaryOperatorType } from "./binary-operator-type.enum";

export class BinaryOperator implements Operator {

    operands: Operator[];
    leftOperand: Operator;
    rightOperand: Operator;
    operatorType: BinaryOperatorType;

}
