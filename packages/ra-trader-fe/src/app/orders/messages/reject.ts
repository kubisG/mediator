import "reflect-metadata";
import { Mapping, MappingRequirement } from "light-mapper";

export class Reject {

    @Mapping(MappingRequirement.OPTIONAL)
    RaID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    ClientID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    SenderCompID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    DeliverToCompID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    OnBehalfOfCompID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    RequestType: string;

    @Mapping(MappingRequirement.OPTIONAL)
    ClOrdID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    OrdStatus: string;

    @Mapping(MappingRequirement.OPTIONAL)
    TransactTime: string;

    @Mapping(MappingRequirement.OPTIONAL)
    Account: string;

    @Mapping(MappingRequirement.OPTIONAL)
    OrdRejReason: string;

    @Mapping(MappingRequirement.OPTIONAL)
    CxlRejResponseTo: string;

    @Mapping(MappingRequirement.OPTIONAL)
    CxlRejReason: string;

    @Mapping(MappingRequirement.OPTIONAL)
    OrderID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    msgType: string;

    @Mapping(MappingRequirement.OPTIONAL)
    TargetCompID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    OrigClOrdID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    specType: string;
}
