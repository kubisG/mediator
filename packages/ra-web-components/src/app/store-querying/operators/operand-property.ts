import { Operator } from "./operator.interface";

export class OperandProperty implements Operator {

    public operands: Operator[];

    constructor(
        public propertyName: string
    ) { }

}
