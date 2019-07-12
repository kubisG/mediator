import { AppDirectoryItemDto } from "./app-directory-item.dto";
import { ApiModelProperty } from "@nestjs/swagger";
export class AppDirectoryDto {

    @ApiModelProperty()
    applications: AppDirectoryItemDto[];

}
