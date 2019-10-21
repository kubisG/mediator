import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from "@nestjs/websockets";
import { UseGuards, Inject } from "@nestjs/common";
import { WsAuthGuard } from "@ra/web-auth-be/dist/guards/ws-auth.guard";
import { TraderService } from "./trader.service";
import { Observable } from "rxjs/internal/Observable";
import { ConsumeDto } from "../messages/dto/consume.dto";
import { InfoDto } from "../orders/dto/info.dto";
import { ExceptionDto } from "../orders/dto/exception.dto";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { UserData } from "../users/user-data.interface";

@WebSocketGateway({
    namespace: "trader",
})
@UseGuards(WsAuthGuard)
export class TraderGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        @Inject("logger") private logger: Logger,
        @Inject("traderOrderService") private traderService: TraderService,
        public authService: AuthService,
    ) { }

    @SubscribeMessage("consume")
    public onConsume(client, data): Observable<ConsumeDto> {
        return this.traderService.consumeMessages(client.handshake.query.token, client);
    }

    @SubscribeMessage("send")
    public async onSend(client, data) {
        const userData = await this.authService.getUserData<UserData>(client.handshake.query.token);
        return await this.traderService.sendMsg(data, userData);
    }

    @SubscribeMessage("cancelAll")
    public async onCancelAll(client, data) {
        return await this.traderService.cancelAllOrder(data, client.handshake.query.token);
    }

    @SubscribeMessage("info")
    public onInfo(client, data): Promise<Observable<InfoDto>> {
        return this.traderService.consumeInfo(client.handshake.query.token, client);
    }

    @SubscribeMessage("exception")
    public onException(client, data): Promise<Observable<ExceptionDto>> {
        return this.traderService.exception(client.handshake.query.token, client);
    }

    public async handleDisconnect(client: any) {
        this.logger.silly(`handleDisconnect: ${client.client.id}`);
        await this.traderService.removeClient(client);
    }

    handleConnection(client: any, ...args: any[]) {
        this.logger.silly(`handleConnection: ${client.client.id}`);
    }

}
