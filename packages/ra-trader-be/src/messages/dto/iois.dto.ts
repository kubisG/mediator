import { ApiModelPropertyOptional, ApiModelProperty } from "@nestjs/swagger";

export class IoisDto {
    @ApiModelPropertyOptional()
    readonly id?: number;
    @ApiModelProperty()
    RaID: string;
    @ApiModelProperty()
    msgType: string;
    @ApiModelPropertyOptional()
    TransactTime?: Date;
    @ApiModelProperty()
    IOIid: string;
    @ApiModelPropertyOptional()
    IOIRefID?: string;
    @ApiModelPropertyOptional()
    IOITransType?: string;
    @ApiModelProperty()
    Symbol: string;
    @ApiModelProperty()
    Side: string;
    @ApiModelPropertyOptional()
    IOIQty?: number;
    @ApiModelPropertyOptional()
    Price?: number;
    @ApiModelPropertyOptional()
    Currency?: string;
    @ApiModelPropertyOptional()
    ValidUntilTime?: Date;
    @ApiModelPropertyOptional()
    Text?: string;
    @ApiModelPropertyOptional()
    JsonMessage?: string;
    @ApiModelPropertyOptional()
    TargetCompID?: string;
    @ApiModelPropertyOptional()
    ExDestination?: string;
    company?: number;
    user?: number;
}
