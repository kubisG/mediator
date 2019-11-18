import { OperationParametersType } from "./operation-parameters-type.enum";

export class OperationsDto {
    path: string;
    parameters: {
        name: string,
        type: OperationParametersType,
    };
}
