import { Operator } from "./operator.interface";

export class BetweenOperator implements Operator {

    operands: Operator[];
    beginExpression: Operator;
    testExpression: Operator;
    endExpression: Operator;

}
