import { Operator } from "./operator.interface";

export class OperandValue implements Operator {

    public operands: Operator[];

    constructor(
        public value: string,
    ) { }

}
