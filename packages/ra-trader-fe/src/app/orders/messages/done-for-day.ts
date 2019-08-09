import "reflect-metadata";
import { Mapping, MappingRequirement } from "light-mapper";
import { Execution } from "./execution";

export class DoneForDay extends Execution {
    @Mapping(MappingRequirement.OPTIONAL)
    Commission: number;
    @Mapping(MappingRequirement.OPTIONAL)
    CommType: number;
}
