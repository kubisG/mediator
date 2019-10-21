import { ApiModelPropertyOptional, ApiModelProperty } from "@nestjs/swagger";

export class AllocationsDto {
    @ApiModelPropertyOptional()
    readonly id?: number;
    @ApiModelPropertyOptional()
    RaID: string;
    @ApiModelProperty()
    AllocID?: string;
    @ApiModelPropertyOptional()
    AllocTransType?: string;
    @ApiModelPropertyOptional()
    AllocShares?: string;
    @ApiModelPropertyOptional()
    AllocAccount?: string;
    @ApiModelPropertyOptional()
    AllocStatus?: string;
    @ApiModelPropertyOptional()
    AllocText?: string;
    @ApiModelPropertyOptional()
    Commission?: number;
    @ApiModelPropertyOptional()
    CommType?: string;
    @ApiModelPropertyOptional()
    TargetCompID?: string;
    @ApiModelPropertyOptional()
    ExDestination?: string;
    company?: number;
    user?: number;
}
