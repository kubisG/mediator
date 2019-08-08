import { Operator } from "./operator.interface";

export class ClearOperator implements Operator {
    operands: Operator[];
}
