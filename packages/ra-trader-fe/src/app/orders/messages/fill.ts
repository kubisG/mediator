import "reflect-metadata";
import { Mapping, MappingRequirement } from "light-mapper";
import { Execution } from "./execution";

export class Fill extends Execution {
    @Mapping(MappingRequirement.OPTIONAL)
    LastMkt: string;
    @Mapping(MappingRequirement.OPTIONAL)
    LastCapacity: string;
    @Mapping(MappingRequirement.OPTIONAL)
    LastLiquidityInd: string;
}
