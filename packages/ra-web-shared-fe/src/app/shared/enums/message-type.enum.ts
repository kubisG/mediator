export enum MessageType {
    Order = "NewOrderSingle",
    Cancel = "OrderCancelRequest",
    Replace = "OrderCancelReplaceRequest",
    OrderCancelReject = "OrderCancelReject",
    Execution = "ExecutionReport",
    Allocation = "AllocationInstruction",
    AllocationAck = "AllocationInstructionAck",
    IOI = "IOI",
}
