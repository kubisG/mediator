import { OperationsDto } from "./operations.dto";

export class StoresDto {
    prefix: string;
    name: string;
    operations: OperationsDto[];
}
