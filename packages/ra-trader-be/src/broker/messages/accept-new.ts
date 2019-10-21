import "reflect-metadata";
import { Mapping, MappingRequirement } from "light-mapper";

export class AcceptNew {

    @Mapping(MappingRequirement.OPTIONAL)
    RaID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    Currency: string;

    @Mapping(MappingRequirement.OPTIONAL)
    MsgSeqNum: string;

    @Mapping(MappingRequirement.OPTIONAL)
    ClientID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    Side: string;

    @Mapping(MappingRequirement.OPTIONAL)
    SenderCompID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    DeliverToCompID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    OnBehalfOfCompID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    AvgPx: number;

    @Mapping(MappingRequirement.OPTIONAL)
    RequestType: string;

    @Mapping(MappingRequirement.OPTIONAL)
    ClOrdID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    OrigClOrdID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    Symbol: string;

    @Mapping(MappingRequirement.OPTIONAL)
    OrdStatus: string;

    @Mapping(MappingRequirement.OPTIONAL)
    CumQty: number;

    @Mapping(MappingRequirement.OPTIONAL)
    ExecInst: string;

    @Mapping(MappingRequirement.OPTIONAL)
    LeavesQty: number;

    @Mapping(MappingRequirement.OPTIONAL)
    OrderID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    ExecID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    HandlInst: string;

    // @Mapping(MappingRequirement.OPTIONAL)
    // userId: number;

    @Mapping(MappingRequirement.OPTIONAL)
    company: number;

    @Mapping(MappingRequirement.OPTIONAL)
    TransactTime: string;

    @Mapping(MappingRequirement.OPTIONAL)
    LastPx: number;

    @Mapping(MappingRequirement.OPTIONAL)
    TimeInForce: string;

    @Mapping(MappingRequirement.OPTIONAL)
    LastQty: number;

    @Mapping(MappingRequirement.OPTIONAL)
    Account: string;

    @Mapping(MappingRequirement.OPTIONAL)
    SendingTime: string;

    @Mapping(MappingRequirement.OPTIONAL)
    OrderQty: number;

    @Mapping(MappingRequirement.OPTIONAL)
    BeginString: string;

    @Mapping(MappingRequirement.OPTIONAL)
    SecurityID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    ExecTransType: string;

    @Mapping(MappingRequirement.OPTIONAL)
    BookingType: string;

    @Mapping(MappingRequirement.OPTIONAL)
    ExecType: string;

    @Mapping(MappingRequirement.OPTIONAL)
    msgType: string;

    @Mapping(MappingRequirement.OPTIONAL)
    OrdType: string;

    @Mapping(MappingRequirement.OPTIONAL)
    Price: string;

    @Mapping(MappingRequirement.OPTIONAL)
    SecurityType: string;

    @Mapping(MappingRequirement.OPTIONAL)
    SecurityIDSource: string;

    @Mapping(MappingRequirement.OPTIONAL)
    SecurityDesc: string;

    @Mapping(MappingRequirement.OPTIONAL)
    TargetCompID: string;

    @Mapping(MappingRequirement.OPTIONAL)
    Placed: string;

    @Mapping(MappingRequirement.OPTIONAL)
    app: number;

    @Mapping(MappingRequirement.OPTIONAL)
    targetApp: number;

    @Mapping(MappingRequirement.OPTIONAL)
    specType: string;
}
