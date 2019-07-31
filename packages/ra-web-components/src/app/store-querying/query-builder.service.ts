import { Operator } from "./operators/operator.interface";
import { Injectable } from "@angular/core";
import { FunctionOperator } from "./operators/function-operator";
import { FunctionOperatorType } from "./operators/function-operator-type.enum";
import { OperandProperty } from "./operators/operand-property";
import { GroupOperator } from "./operators/group-operator";
import { GroupOperatorType } from "./operators/group-operator-type.enum";
import { InOperator } from "./operators/in-operator";
import { OperandValue } from "./operators/operand-value";
import { UnaryOperator } from "./operators/unary-operator";
import { UnaryOperatorType } from "./operators/unary-operator-type.enum";
import { BetweenOperator } from "./operators/between-operator";
import { BinaryOperator } from "./operators/binary-operator";
import { BinaryOperatorType } from "./operators/binary-operator-type.enum";

@Injectable()
export class QueryBuilderService {

    private buildGroupOperator(operator: GroupOperator) {
        let result = "";
        for (let i = 0; i < operator.operands.length; i++) {
            const operand = operator.operands[i];
            result += this.build(operand);
            if (i !== operator.operands.length - 1) {
                result += operator.operatorType === GroupOperatorType.And ? " && " : " || ";
            }
        }
        return result;
    }

    private buildFunctionOperator(operator: FunctionOperator): string {
        switch (operator.operatorType) {
            case FunctionOperatorType.StartsWith: {
                return `${this.build(operator.operands[0])}=${this.build(operator.operands[1])}*`;
            }
            case FunctionOperatorType.EndsWith: {
                return `${this.build(operator.operands[0])}=*${this.build(operator.operands[1])}`;
            }
            case FunctionOperatorType.Contains: {
                return `${this.build(operator.operands[0])}=*${this.build(operator.operands[1])}*`;
            }
            default: {
                return "";
            }
        }
    }

    private buildInOperator(operator: InOperator) {
        let result = `${this.build(operator.leftOperand)}=(`;
        for (let i = 0; i < operator.operands.length; i++) {
            const operandBuild = this.build(operator.operands[i]);
            result += `${i !== operator.operands.length - 1 ? operandBuild + "|" : operandBuild}`;
        }
        return `${result})`;
    }

    private buildOperandProperty(operator: OperandProperty) {
        return operator.propertyName;
    }

    private buildOperandValue(operator: OperandValue) {
        return `'${operator.value}'`;
    }

    private buildUnaryOperator(operator: UnaryOperator) {
        switch (operator.operatorType) {
            case UnaryOperatorType.Not: {
                return `!${this.build(operator.operand)}`;
            }
            default: {
                return ``;
            }
        }
    }

    private buildBetweenOperator(operator: BetweenOperator) {
        const beginExpression = this.build(operator.beginExpression);
        const testExpression = this.build(operator.testExpression);
        const endExpression = this.build(operator.endExpression);
        return `${testExpression}>${beginExpression} && ${testExpression}<${endExpression}`;
    }

    private buildBinaryOperator(operator: BinaryOperator) {
        switch (operator.operatorType) {
            case BinaryOperatorType.Equal: {
                return `${this.build(operator.leftOperand)}=${this.build(operator.rightOperand)}`;
            }
            case BinaryOperatorType.Greater: {
                return `${this.build(operator.leftOperand)}>${this.build(operator.rightOperand)}`;
            }
            case BinaryOperatorType.GreaterOrEqual: {
                return `${this.build(operator.leftOperand)}>=${this.build(operator.rightOperand)}`;
            }
            case BinaryOperatorType.Less: {
                return `${this.build(operator.leftOperand)}<${this.build(operator.rightOperand)}`;
            }
            case BinaryOperatorType.LessOrEqual: {
                return `${this.build(operator.leftOperand)}<=${this.build(operator.rightOperand)}`;
            }
            case BinaryOperatorType.NotEqual: {
                return `${this.build(operator.leftOperand)}!=${this.build(operator.rightOperand)}`;
            }
        }
        return "";
    }

    public build(operator: Operator): string {
        if (operator instanceof GroupOperator) {
            return this.buildGroupOperator(operator);
        } else if (operator instanceof FunctionOperator) {
            return this.buildFunctionOperator(operator);
        } else if (operator instanceof InOperator) {
            return this.buildInOperator(operator);
        } else if (operator instanceof OperandValue) {
            return this.buildOperandValue(operator);
        } else if (operator instanceof OperandProperty) {
            return this.buildOperandProperty(operator);
        } else if (operator instanceof UnaryOperator) {
            return this.buildUnaryOperator(operator);
        } else if (operator instanceof BetweenOperator) {
            return this.buildBetweenOperator(operator);
        } else if (operator instanceof BinaryOperator) {
            return this.buildBinaryOperator(operator);
        }
        return "";
    }

}
