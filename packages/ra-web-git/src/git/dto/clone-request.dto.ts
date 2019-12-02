import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";

export class CloneRequestDto {
    @ApiModelProperty()
    userName: string;

    @ApiModelProperty()
    password: string;

    @ApiModelProperty()
    repoPath: string;

    @ApiModelPropertyOptional()
    directory?: string;

    @ApiModelPropertyOptional()
    commitLimit?: number; // number of commits
}