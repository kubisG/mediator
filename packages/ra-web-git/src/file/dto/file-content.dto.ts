import { ApiModelProperty } from "@nestjs/swagger";

export class FileContentDto {
    @ApiModelProperty()
    type: "json" | "yaml" | "properties" | "text";

    @ApiModelProperty()
    content: string;
}