import { Mapping, MappingRequirement } from "light-mapper";
import { ApiModelProperty } from "@nestjs/swagger";

export class AppDirectorySearchDto {

    @ApiModelProperty()
    @Mapping(MappingRequirement.OPTIONAL)
    appId: string;

    @ApiModelProperty()
    @Mapping(MappingRequirement.OPTIONAL)
    name: string;

    @ApiModelProperty()
    @Mapping(MappingRequirement.OPTIONAL)
    manifest: any;

    @ApiModelProperty()
    @Mapping(MappingRequirement.OPTIONAL)
    version: string;

    @ApiModelProperty()
    @Mapping(MappingRequirement.OPTIONAL)
    title: string;

    @ApiModelProperty()
    @Mapping(MappingRequirement.OPTIONAL)
    tooltip: string;

    @ApiModelProperty()
    @Mapping(MappingRequirement.OPTIONAL)
    description: string;

    @ApiModelProperty()
    @Mapping(MappingRequirement.OPTIONAL)
    intent_name: string;

    @ApiModelProperty()
    @Mapping(MappingRequirement.OPTIONAL)
    intent_displayName: string;

    @ApiModelProperty()
    @Mapping(MappingRequirement.OPTIONAL)
    intent_context: string;
}
