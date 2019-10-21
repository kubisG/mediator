import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";

export class PortfolioDto {

    @ApiModelProperty()
    readonly id?: number;

    @ApiModelPropertyOptional()
    readonly RiskBeta?: number;

    @ApiModelPropertyOptional()
    readonly CurrentPrice?: number;

    @ApiModelPropertyOptional()
    readonly Dividend?: number;

    @ApiModelPropertyOptional()
    readonly CapGain?: string;

    @ApiModelPropertyOptional()
    readonly Custodian?: string;

    readonly Symbol?: string;
    readonly StockName?: string;
    readonly Account?: string;
    readonly FirstTrade?: Date;
    readonly Quantity?: number;
    readonly BookPrice?: number;
    readonly Currency?: string;

    readonly Profit?: number;
    readonly userId?: number;
    readonly companyId?: number;
    readonly createdDate?: Date;
    readonly updateDate?: Date;
}
