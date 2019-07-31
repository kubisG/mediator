import { ApiModelPropertyOptional, ApiModelProperty } from "@nestjs/swagger";

export class CompanyDto {
    @ApiModelPropertyOptional()
    readonly id: number;
    @ApiModelProperty()
    readonly companyName: string;
    @ApiModelPropertyOptional()
    readonly street: string;
    @ApiModelPropertyOptional()
    readonly city: string;
    @ApiModelPropertyOptional()
    readonly numInStreet: string;
    @ApiModelPropertyOptional()
    readonly state: string;
    @ApiModelPropertyOptional()
    readonly partyID: string;
    @ApiModelPropertyOptional()
    readonly partyIDSource: string;
    @ApiModelPropertyOptional()
    readonly partyRole: string;
    @ApiModelPropertyOptional()
    readonly flgDel: string;
}
