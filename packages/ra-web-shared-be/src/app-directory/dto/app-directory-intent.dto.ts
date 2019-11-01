import { Mapping, MappingRequirement } from "light-mapper";
import { ApiModelProperty } from "@nestjs/swagger";

export class AppDirectoryIntentDto {

    @ApiModelProperty()
    @Mapping(MappingRequirement.REQUIRED)
    name: string;

    @ApiModelProperty()
    @Mapping(MappingRequirement.REQUIRED)
    displayName: string;

    @ApiModelProperty()
    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value) => {
            return value === null ? undefined : value;
        },
    })
    contexts: string[];

    @ApiModelProperty()
    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value) => {
            return value === null ? undefined : value;
        },
    })
    customConfig: any;
}
