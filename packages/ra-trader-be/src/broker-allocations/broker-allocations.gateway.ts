import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from "@nestjs/websockets";
import { UseGuards, Inject } from "@nestjs/common";
import { WsAuthGuard } from "@ra/web-auth-be/dist/guards/ws-auth.guard";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { BrokerAllocationsService } from "./broker-allocations.service";

@WebSocketGateway({
    namespace: "broker-allocations",
})
@UseGuards(WsAuthGuard)
export class BrokerAllocationsGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        @Inject("logger") private logger: Logger,
        private allocationsService: BrokerAllocationsService,
    ) { }

    @SubscribeMessage("send")
    public async onSend(client, data) {
        return this.allocationsService.sendAllocations(data, client.handshake.query.token);
    }

    @SubscribeMessage("consume")
    public onConsume(client, data) {
        return this.allocationsService.consumeMessages(client.handshake.query.token);
    }

    handleDisconnect(client: any) {
        this.logger.info(`handleDisconnect ${client.id}`);
    }

    handleConnection(client: any) {
        this.logger.info(`handleConnection ${client.id}`);
    }

}
