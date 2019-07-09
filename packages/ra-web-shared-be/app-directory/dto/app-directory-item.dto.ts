import { AppDirectoryIntentDto } from "./app-directory-intent.dto";
import { Mapping, MappingRequirement } from "light-mapper";

export class AppDirectoryItemDto {

    @Mapping(MappingRequirement.REQUIRED)
    appId: string;

    @Mapping(MappingRequirement.REQUIRED)
    name: string;

    @Mapping(MappingRequirement.REQUIRED)
    manifest: string;

    @Mapping(MappingRequirement.REQUIRED)
    manifestType: string;

    @Mapping(MappingRequirement.OPTIONAL)
    version: string;

    @Mapping(MappingRequirement.OPTIONAL)
    title: string;

    @Mapping(MappingRequirement.OPTIONAL)
    tooltip: string;

    @Mapping(MappingRequirement.OPTIONAL)
    description: string;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value) => JSON.parse(value)
    })
    images: { url: string }[];

    @Mapping(MappingRequirement.OPTIONAL)
    contactEmail: string;

    @Mapping(MappingRequirement.OPTIONAL)
    supportEmail: string;

    @Mapping(MappingRequirement.OPTIONAL)
    publisher: string;

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value) => JSON.parse(value)
    })
    icons: { icon: string }[];

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value) => JSON.parse(value)
    })
    customConfig: {
        name: string;
        value: string;
    }[];

    @Mapping({
        requirement: MappingRequirement.OPTIONAL,
        transformation: (value) => JSON.parse(value)
    })
    intents: AppDirectoryIntentDto[];
}
