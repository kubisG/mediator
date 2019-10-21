import { WebSocketGateway, SubscribeMessage } from "@nestjs/websockets";
import { UseGuards, Inject } from "@nestjs/common";
import { WsAuthGuard } from "@ra/web-auth-be/dist/guards/ws-auth.guard";
import { BrokerService } from "./broker.service";
import { Observable } from "rxjs/internal/Observable";
import { ConsumeDto } from "../messages/dto/consume.dto";
import { InfoDto } from "../orders/dto/info.dto";
import { ExceptionDto } from "../orders/dto/exception.dto";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";

@WebSocketGateway({
    namespace: "broker",
})
@UseGuards(WsAuthGuard)
export class BrokerGateway {
    constructor(
        @Inject("logger") private logger: Logger,
        @Inject("brokerOrderService") private brokerService: BrokerService,
        public authService: AuthService,
    ) { }

    @SubscribeMessage("consume")
    public onConsume(client, data): Observable<ConsumeDto> {
        return this.brokerService.consumeMessages(client.handshake.query.token, client);
    }

    @SubscribeMessage("send")
    public async onSend(client, data) {
        return await this.brokerService.sendMsg(data, client.handshake.query.token);
    }

    @SubscribeMessage("cancelAll")
    public async onCancelAll(client, data) {
        return await this.brokerService.cancelAllOrder(data, client.handshake.query.token);
    }

    @SubscribeMessage("info")
    public onInfo(client, data): Promise<Observable<InfoDto>> {
        return this.brokerService.consumeInfo(client.handshake.query.token, client);
    }

    @SubscribeMessage("sleuth")
    public onSleuth(client, data): Observable<any> {
        return this.brokerService.hasSleuth();
    }

    @SubscribeMessage("exception")
    public onException(client, data): Promise<Observable<ExceptionDto>> {
        return this.brokerService.exception(client.handshake.query.token, client);
    }

    public async handleDisconnect(client: any) {
        this.logger.silly(`handleDisconnect: ${client.client.id}`);
        await this.brokerService.removeClient(client);
    }

    public async handleConnection(client: any, ...args: any[]) {
        this.logger.silly(`handleConnection: ${client.client.id}`);
    }

}
