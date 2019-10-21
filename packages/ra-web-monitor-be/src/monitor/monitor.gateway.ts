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
import { MonitorService } from "./monitor.service";

@WebSocketGateway({
    namespace: "monitor",
})
@UseGuards(WsAuthGuard)
export class MonitorGateWay implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        @Inject("logger") private logger: Logger,
        private monitorService: MonitorService,
    ) { }

    @SubscribeMessage("response")
    public onResponse(client, data) {
        return this.monitorService.getClientSubject(client);
    }

    @SubscribeMessage("request")
    public onRequest(client, data) {
        return this.monitorService.sendRequest(client, data);
    }

    public async handleConnection(client: any, ...args: any[]) {
        this.logger.silly(`handleConnection: ${client.client.id}`);
        await this.monitorService.addClient(client);
    }

    public async handleDisconnect(client: any) {
        this.logger.silly(`handleDisconnect: ${client.client.id}`);
        await this.monitorService.removeClient(client);
    }

    public afterInit(server: any) {

    }

}
