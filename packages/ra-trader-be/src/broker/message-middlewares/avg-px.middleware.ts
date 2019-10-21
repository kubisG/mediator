import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { Injectable, Inject } from "@nestjs/common";
import { MessageType } from "@ra/web-core-be/dist/enums/message-type.enum";
import { ExecType } from "@ra/web-core-be/dist/enums/exec-type.enum";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { ContextMiddlewareInterface } from "@ra/web-core-be/dist/middlewares/context-middleware.interface";

@Injectable()
export class AvgPxMiddleware implements MessageMiddleware {

    constructor(
        @Inject("logger") private logger: Logger,
    ) { }

    private async  setAvgPx(data: any, context: any) {
        if ((data.msgType === MessageType.Execution) &&
            ((data.ExecType === ExecType.TradeCancel)
                || (data.ExecType === ExecType.Trade)
                || (data.ExecType === ExecType.Fill)
                || (data.ExecType === ExecType.PartialFill))) {
            const qtyDiff = data.CumQty - data.LastQty;
            if (qtyDiff === 0) {
                data.AvgPx = data.LastPx;
                return data;
            }
            if (isNaN(qtyDiff)) {
                return data;
            }
            const avgPx = data.AvgPx ? data.AvgPx : data.Price;
            const result = ((qtyDiff * avgPx) + (data.LastQty * data.LastPx)) / data.CumQty;
            if (isNaN(result)) {
                return data;
            }
            data.AvgPx = result;
        }
        return data;
    }

    async resolve(data: any, context: ContextMiddlewareInterface): Promise<any> {
        data = await this.setAvgPx(data, context);
        return data;
    }
}
