import { Operator } from "./operator.interface";
import { GroupOperatorType } from "./group-operator-type.enum";

export class GroupOperator implements Operator {

    operands: Operator[] = [];
    operatorType: GroupOperatorType;

}
