import { ApiModelProperty } from "@nestjs/swagger";

export class PullSummaryDto {

    @ApiModelProperty()
    changes: number;

    @ApiModelProperty()
    insertions: number;

    @ApiModelProperty()
    deletions: number;
}