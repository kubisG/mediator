import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";

export class FileDto {
    @ApiModelProperty()
    name: string;

    @ApiModelProperty()
    path: string;

    @ApiModelProperty()
    directory: boolean;

    @ApiModelPropertyOptional({ type: [FileDto] })
    files?: FileDto[];
}