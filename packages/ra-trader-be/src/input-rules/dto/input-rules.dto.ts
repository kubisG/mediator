import { ApiModelPropertyOptional, ApiModelProperty } from "@nestjs/swagger";

export class InputRulesDto {
    @ApiModelPropertyOptional()
    readonly id?: number;
    @ApiModelPropertyOptional()
    readonly rootId?: number;
    @ApiModelPropertyOptional()
    readonly parentId?: number;
    @ApiModelProperty()
    readonly label: string;
    @ApiModelProperty()
    readonly value: string;
    @ApiModelPropertyOptional()
    readonly name: string;
    @ApiModelPropertyOptional()
    readonly level: number;
}
export class RulesDto {
    @ApiModelPropertyOptional()
    companyId: number;
    @ApiModelPropertyOptional( { isArray: true, type: InputRulesDto } )
    inputs: InputRulesDto[];
    @ApiModelPropertyOptional({ type: Array })
    del: any[];
}
