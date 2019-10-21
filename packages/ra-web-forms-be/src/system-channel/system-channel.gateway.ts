import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from "@nestjs/websockets";
import { UseGuards, Inject } from "@nestjs/common";
import { WsAuthGuard } from "@ra/web-auth-be/dist/guards/ws-auth.guard";
import { SystemChannelService } from "./system-channel.service";
import { Observable } from "rxjs/internal/Observable";
import { ExceptionDto } from "./dto/exception.dto";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { InfoDto } from "./dto/info.dto";

@WebSocketGateway({
    namespace: "system",
})
@UseGuards(WsAuthGuard)
export class SystemChannelGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        @Inject("logger") private logger: Logger,
        public authService: AuthService,
        public systemService: SystemChannelService,
    ) { }

    @SubscribeMessage("info")
    public onInfo(client, data): Promise<Observable<InfoDto>> {
        return this.systemService.info(client.handshake.query.token, client);
    }

    @SubscribeMessage("exception")
    public onException(client, data): Promise<Observable<ExceptionDto>> {
        return this.systemService.exception(client.handshake.query.token, client);
    }

    public async handleDisconnect(client: any) {
        this.logger.silly(`handleDisconnect: ${client.client.id}`);
        await this.systemService.removeClient(client);
    }

    public async handleConnection(client: any, ...args: any[]) {
        this.logger.silly(`handleConnection: ${client.client.id}`);
    }

}
