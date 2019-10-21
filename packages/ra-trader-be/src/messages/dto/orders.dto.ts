import { ApiModelPropertyOptional, ApiModelProperty } from "@nestjs/swagger";

export class OrdersDto {
    id?: number;
    @ApiModelProperty()
    action: string;
    @ApiModelProperty()
    ClOrdID: string;
    @ApiModelPropertyOptional()
    ClOrdLinkID: string;
    @ApiModelProperty()
    msgType: string;
    @ApiModelProperty()
    OrderQty: number;
    @ApiModelProperty()
    SenderCompID: string;
    @ApiModelProperty()
    Side: string;
    @ApiModelProperty()
    Symbol: string;
    @ApiModelProperty()
    Currency: string;
    @ApiModelProperty()
    ExDestination: string;
    @ApiModelProperty()
    ExecInst: string;
    @ApiModelProperty()
    OrdType: string;
    @ApiModelProperty()
    TimeInForce: string;
    @ApiModelPropertyOptional()
    RaID: string;
    @ApiModelPropertyOptional()
    Price?: number;
    @ApiModelPropertyOptional()
    StopPx?: number;
    @ApiModelPropertyOptional()
    Text?: string;
    @ApiModelPropertyOptional()
    Account?: string;
    @ApiModelPropertyOptional()
    OnBehalfOfSubID?: string;
    @ApiModelPropertyOptional()
    BookingType?: string;
    @ApiModelPropertyOptional()
    NewOrderQty?: number;
    @ApiModelPropertyOptional()
    SecurityID: string;
    @ApiModelPropertyOptional()
    SecurityIDSource: string;
    @ApiModelPropertyOptional()
    TradeDate?: Date;
    @ApiModelPropertyOptional()
    SettlDate?: Date;
    @ApiModelPropertyOptional()
    Oddlot?: Date;
    @ApiModelPropertyOptional()
    ExpireDate?: Date;
    @ApiModelPropertyOptional()
    LocateReqd?: string;
    @ApiModelPropertyOptional()
    OrderCapacity?: string;
    @ApiModelPropertyOptional()
    CommType?: string;
    @ApiModelPropertyOptional()
    Commission?: string;
    OrigClOrdID?: string;
    TransactTime?: Date;
    RequestType?: string;
    Placed?: Date;
    OrdStatus?: string;
    createDate?: Date;
    updateDate?: Date;
    OrderPackage?: string;
    compQueue?: string;
    company?: number;
    user?: number;
    userId?: number;
    JsonMessage?: any;
    companyId?: number;
    CumQty?: number;
    LeavesQty?: number;
    LastQty?: number;
    AvgPx?: number;
    LastPx?: number;
    Profit?: number;
}
