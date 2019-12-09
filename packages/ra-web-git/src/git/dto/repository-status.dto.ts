import { ApiModelProperty } from "@nestjs/swagger";

export class RepoStatusDto {

    @ApiModelProperty()
    unstaged: string[];

    @ApiModelProperty()
    modified: string[];

    @ApiModelProperty()
    deleted: string[];

    @ApiModelProperty()
    conflicted: string[];
}