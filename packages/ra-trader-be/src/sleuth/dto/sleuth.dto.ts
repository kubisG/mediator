import { ApiModelPropertyOptional } from "@nestjs/swagger";

export class SleuthDto {
    @ApiModelPropertyOptional()
    readonly Symbol: string;
    @ApiModelPropertyOptional()
    readonly Side: string;
    @ApiModelPropertyOptional()
    readonly ClientID: string;
    @ApiModelPropertyOptional()
    readonly CumQty: string;
    @ApiModelPropertyOptional()
    readonly Price: string;
}
