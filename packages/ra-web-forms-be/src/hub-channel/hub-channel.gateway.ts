import {
    WebSocketGateway,
    SubscribeMessage,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from "@nestjs/websockets";
import { UseGuards, Inject } from "@nestjs/common";
import { WsAuthGuard } from "@ra/web-auth-be/dist/guards/ws-auth.guard";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { HubChannelService } from "./hub-channel.service";

@WebSocketGateway({
    namespace: "hubdata",
})
@UseGuards(WsAuthGuard)
export class HubChannelGateWay implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        @Inject("logger") private logger: Logger,
        private hubChannelService: HubChannelService,
    ) { }

    @SubscribeMessage("data")
    public onResponse(client, data) {
        return this.hubChannelService.getClientSubject(client);
    }

    public async handleConnection(client: any, ...args: any[]) {
        this.logger.silly(`handleConnection: ${client.client.id}`);
        await this.hubChannelService.addClient(client);
    }

    public async handleDisconnect(client: any) {
        this.logger.silly(`handleDisconnect: ${client.client.id}`);
        await this.hubChannelService.removeClient(client);
    }

    public afterInit(server: any) {

    }

}
