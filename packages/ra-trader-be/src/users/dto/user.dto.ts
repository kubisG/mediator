import { ApiModelPropertyOptional, ApiModelProperty } from "@nestjs/swagger";

export class UserDto {

    @ApiModelPropertyOptional()
    readonly id?: number;
    @ApiModelProperty()
    readonly username: string;
    @ApiModelPropertyOptional()
    readonly password?: string;
    @ApiModelPropertyOptional()
    readonly firstName: string;
    @ApiModelPropertyOptional()
    readonly lastName: string;
    @ApiModelPropertyOptional()
    readonly mobile: string;
    @ApiModelPropertyOptional()
    readonly deskPhone: string;
    @ApiModelProperty()
    readonly email: string;
    readonly createDate?: Date;
    readonly lastLogin?: Date;
    readonly lastAction?: Date;
    @ApiModelPropertyOptional()
    readonly class?: string;
    readonly flgDel?: string;
    readonly store?: any[];
    @ApiModelProperty()
    company?: any;
    @ApiModelPropertyOptional()
    readonly openBalance?: any;
    @ApiModelPropertyOptional()
    readonly currentBalance?: any;
    @ApiModelProperty()
    app: number;
}
