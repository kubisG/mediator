import { ApiModelPropertyOptional, ApiModelProperty } from "@nestjs/swagger";

export class AccountsDto {
    @ApiModelPropertyOptional()
    readonly id?: number;
    @ApiModelPropertyOptional()
    name: string;
    @ApiModelProperty()
    code?: string;
    @ApiModelPropertyOptional()
    info?: string;
    @ApiModelPropertyOptional()
    settlement1?: string;
    @ApiModelPropertyOptional()
    settlement2?: string;
    @ApiModelPropertyOptional()
    active?: string;
    company?: number;
}
