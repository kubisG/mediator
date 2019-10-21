import { ApiModelPropertyOptional, ApiModelProperty } from "@nestjs/swagger";

export class FilterDto {
    @ApiModelProperty()
    date: string;
    @ApiModelProperty()
    app: number;
    @ApiModelPropertyOptional()
    comp?: string;
    @ApiModelPropertyOptional()
    gtcGtd?: string;
    @ApiModelPropertyOptional()
    clOrdLinkID?: string;
}
