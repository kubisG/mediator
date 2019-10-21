import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from "@nestjs/websockets";
import { UseGuards, Inject } from "@nestjs/common";
import { WsAuthGuard } from "@ra/web-auth-be/dist/guards/ws-auth.guard";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { TraderAllocationsService } from "./trader-allocations.service";

@WebSocketGateway({
    namespace: "allocations",
})
@UseGuards(WsAuthGuard)
export class TraderAllocationsGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        @Inject("logger") private logger: Logger,
        private allocationsService: TraderAllocationsService,
    ) { }

    @SubscribeMessage("send")
    public async onSend(client, data) {
        return await this.allocationsService.sendAllocations(data, client.handshake.query.token);
    }

    @SubscribeMessage("consume")
    public onConsume(client, data) {
        return this.allocationsService.consumeMessages(client.handshake.query.token);
    }

    handleDisconnect(client: any) {
        this.logger.info(`handleConnection ${client.id}`);
    }

    handleConnection(client: any) {
        this.logger.info(`handleDisconnect ${client.id}`);
    }

}
