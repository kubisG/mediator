import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from "@nestjs/websockets";
import { UseGuards, Inject } from "@nestjs/common";
import { WsAuthGuard } from "@ra/web-auth-be/dist/guards/ws-auth.guard";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { BrokerIoisService } from "./broker-iois.service";
import { Observable } from "rxjs";
import { ExceptionDto } from "../orders/dto/exception.dto";

@WebSocketGateway({
    namespace: "broker-iois",
})
@UseGuards(WsAuthGuard)
export class BrokerIoisGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        @Inject("logger") private logger: Logger,
        private ioisService: BrokerIoisService,
    ) { }

    @SubscribeMessage("send")
    public async onSend(client, data) {
        return await this.ioisService.sendIois(data, client.handshake.query.token);
    }

    @SubscribeMessage("consume")
    public onConsume(client, data) {
        return this.ioisService.consumeMessages(client.handshake.query.token);
    }

    @SubscribeMessage("exception")
    public onException(): Observable<ExceptionDto> {
        return this.ioisService.exception();
    }

    handleDisconnect(client: any) {
        this.logger.info(`handleConnection ${client.id}`);
    }

    handleConnection(client: any) {
        this.logger.info(`handleDisconnect ${client.id}`);
    }

}
