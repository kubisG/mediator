import { ApiModelPropertyOptional } from "@nestjs/swagger";

export class PrefDto {
    @ApiModelPropertyOptional()
    readonly allOrders: string;
    @ApiModelPropertyOptional()
    readonly notify: string;
    @ApiModelPropertyOptional()
    readonly rows: string;
    @ApiModelPropertyOptional()
    readonly theme: string;
    @ApiModelPropertyOptional()
    readonly rowColors: {};
}

export class FilterDto {
    @ApiModelPropertyOptional()
    showOnlyMe: boolean;
}
export class PreferenceDto {

    @ApiModelPropertyOptional()
    readonly pref?: PrefDto;
    @ApiModelPropertyOptional()
    readonly filter?: FilterDto;
}
