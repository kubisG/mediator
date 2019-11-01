import { AppDirectoryIntentDto } from "./app-directory-intent.dto";
import { Mapping, MappingRequirement } from "light-mapper";
import { ApiModelProperty } from "@nestjs/swagger";

export class AppDirectoryItemDto {

    @ApiModelProperty()
    @Mapping(MappingRequirement.REQUIRED)
    appId: string;

    @ApiModelProperty()
    @Mapping(MappingRequirement.REQUIRED)
    name: string;

    @ApiModelProperty()
    @Mapping(MappingRequirement.REQUIRED)
    manifest: string;

    @ApiModelProperty()
    @Mapping(MappingRequirement.REQUIRED)
    manifestType: string;

    @ApiModelProperty()
    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value) => {
            return value === null ? undefined : value;
        },
    })
    version: string;

    @ApiModelProperty()
    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value) => {
            return value === null ? undefined : value;
        },
    })
    title: string;

    @ApiModelProperty()
    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value) => {
            return value === null ? undefined : value;
        },
    })
    tooltip: string;

    @ApiModelProperty()
    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value) => {
            return value === null ? undefined : value;
        },
    })
    description: string;

    @ApiModelProperty()
    @Mapping(MappingRequirement.OPTIONAL)
    images: { url: string }[];

    @ApiModelProperty()
    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value) => {
            return value === null ? undefined : value;
        },
    })
    contactEmail: string;

    @ApiModelProperty()
    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value) => {
            return value === null ? undefined : value;
        },
    })
    supportEmail: string;

    @ApiModelProperty()
    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value) => {
            return value === null ? undefined : value;
        },
    })
    publisher: string;

    @ApiModelProperty()
    @Mapping(MappingRequirement.OPTIONAL)
    icons: { icon: string }[];

    @ApiModelProperty()
    @Mapping(MappingRequirement.OPTIONAL)
    customConfig: {
        name: string;
        value: string;
    }[];

    @ApiModelProperty()
    @Mapping(MappingRequirement.OPTIONAL)
    intents: AppDirectoryIntentDto[];
}
