import "reflect-metadata";
import { Mapping, MappingRequirement } from "light-mapper";

export class OrderNew {
    @Mapping(MappingRequirement.OPTIONAL)
    Side: string;
    @Mapping(MappingRequirement.OPTIONAL)
    OrderQty: string;
    @Mapping(MappingRequirement.OPTIONAL)
    SecurityDesc: string;
    @Mapping(MappingRequirement.OPTIONAL)
    Symbol: string;
    @Mapping(MappingRequirement.OPTIONAL)
    SecurityID: string;
    @Mapping(MappingRequirement.OPTIONAL)
    SecurityIDSource: string;
    @Mapping(MappingRequirement.OPTIONAL)
    OrdType: string;
    @Mapping(MappingRequirement.OPTIONAL)
    TradeDate: string;
    @Mapping(MappingRequirement.OPTIONAL)
    Price: number;
    @Mapping(MappingRequirement.OPTIONAL)
    StopPx: number;
    @Mapping(MappingRequirement.OPTIONAL)
    OddLot: boolean;
    @Mapping(MappingRequirement.OPTIONAL)
    SettlDate: string;
    @Mapping(MappingRequirement.OPTIONAL)
    Currency: string;
    @Mapping(MappingRequirement.OPTIONAL)
    LocateReqd: boolean;
    @Mapping(MappingRequirement.OPTIONAL)
    ExecInst: string;
    @Mapping(MappingRequirement.OPTIONAL)
    TimeInForce: string;
    @Mapping(MappingRequirement.OPTIONAL)
    ExpireDate: string;
    @Mapping(MappingRequirement.OPTIONAL)
    OrderCapacity: string;
}
