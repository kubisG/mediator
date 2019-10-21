import { WebSocketGateway, SubscribeMessage } from "@nestjs/websockets";
import { UseGuards, Inject } from "@nestjs/common";
import { WsAuthGuard } from "@ra/web-auth-be/dist/guards/ws-auth.guard";
import { Observable } from "rxjs/internal/Observable";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { StatusDto } from "./dto/status.dto";
import { HubService } from "./hub.service";

@WebSocketGateway({
    namespace: "diagnostic",
})
@UseGuards(WsAuthGuard)
export class DiagnosticsGateway {
    constructor(
        public diagnosticsHubService: HubService,
        public authService: AuthService,
    ) { }

    @SubscribeMessage("status")
    public onConsume(client, data): Observable<StatusDto> {
        return this.diagnosticsHubService.getStatus();
    }

    handleDisconnect(client: any) {

    }

    handleConnection(client: any, ...args: any[]) {

    }
}
