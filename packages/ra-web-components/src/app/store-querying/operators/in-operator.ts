import { Operator } from "./operator.interface";

export class InOperator implements Operator {

    operands: Operator[];
    leftOperand: Operator;

}
