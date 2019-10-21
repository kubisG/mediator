import { ApiModelPropertyOptional, ApiModelProperty } from "@nestjs/swagger";

export class CounterPartyDto {
    @ApiModelPropertyOptional()
    readonly id?: number;
    @ApiModelProperty()
    ExDestination?: string;
    @ApiModelPropertyOptional()
    CounterParty?: string;
    @ApiModelPropertyOptional()
    DeliveryToCompID?: string;
    @ApiModelPropertyOptional()
    other?: string;
    @ApiModelPropertyOptional()
    active?: string;
    company?: number;
}
