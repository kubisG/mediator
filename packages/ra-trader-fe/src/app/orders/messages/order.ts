import "reflect-metadata";
import { Mapping, MappingRequirement } from "light-mapper";

export class Order {
    @Mapping(MappingRequirement.OPTIONAL)
    Side: string;
    @Mapping(MappingRequirement.OPTIONAL)
    OrderQty: string;
    @Mapping(MappingRequirement.OPTIONAL)
    OnBehalfOfSubID: string;
    @Mapping(MappingRequirement.OPTIONAL)
    DeliverToCompID: string;
    @Mapping(MappingRequirement.OPTIONAL)
    OnBehalfOfCompID: string;
    @Mapping(MappingRequirement.OPTIONAL)
    Account: string;
    @Mapping(MappingRequirement.OPTIONAL)
    AvgPx: number;
    @Mapping(MappingRequirement.OPTIONAL)
    CumQty: number;
    @Mapping(MappingRequirement.OPTIONAL)
    NewOrderQty: number;
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
    ExDestination: string;
    @Mapping(MappingRequirement.OPTIONAL)
    TargetCompID: string;
    @Mapping(MappingRequirement.OPTIONAL)
    OrderCapacity: string;
    @Mapping(MappingRequirement.OPTIONAL)
    CommType: string;
    @Mapping(MappingRequirement.OPTIONAL)
    DeliverToSubID: string;
    @Mapping(MappingRequirement.OPTIONAL)
    Commission: string;
    @Mapping(MappingRequirement.OPTIONAL)
    Text: string;
    @Mapping(MappingRequirement.OPTIONAL)
    BookingType: string;
    @Mapping(MappingRequirement.OPTIONAL)
    RequestType: string;
    @Mapping(MappingRequirement.OPTIONAL)
    TransactTime: string;
    @Mapping(MappingRequirement.OPTIONAL)
    ExecType: string;
    @Mapping(MappingRequirement.OPTIONAL)
    ExecTransType: string;
    @Mapping(MappingRequirement.OPTIONAL)
    company: number;
    @Mapping(MappingRequirement.OPTIONAL)
    user: number;
    @Mapping(MappingRequirement.OPTIONAL)
    SenderCompID: string;
    @Mapping(MappingRequirement.OPTIONAL)
    compQueue: string;
    @Mapping(MappingRequirement.OPTIONAL)
    userId: number;
    @Mapping(MappingRequirement.OPTIONAL)
    ClientID: string;
    @Mapping(MappingRequirement.OPTIONAL)
    msgType: string;
    @Mapping(MappingRequirement.OPTIONAL)
    OrdStatus: string;
    @Mapping(MappingRequirement.OPTIONAL)
    OrderPackage: string;
    @Mapping(MappingRequirement.OPTIONAL)
    createDate: string;
    @Mapping(MappingRequirement.OPTIONAL)
    updateDate: string;
    @Mapping(MappingRequirement.OPTIONAL)
    Placed: string;
}
