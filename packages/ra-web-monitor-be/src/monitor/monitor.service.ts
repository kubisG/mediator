import { Injectable, Inject } from "@nestjs/common";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { MonitorClientRouterService } from "./monitor-client-router.service";
import { MonitorMessageRouterService } from "./monitor-message-router.service";
import { UserData } from "@ra/web-shared-be/dist/users/user-data.interface";
import { RequestType } from "./dto/request/request-type.enum";
import { Request } from "./dto/request/request.interface";
import { FastRandom } from "@ra/web-core-be/dist/fast-random.interface";
import { SocketClient } from "@ra/web-core-be/dist/interfaces/socket-client.interface";

@Injectable()
export class MonitorService {

    constructor(
        private authService: AuthService,
        private clientRouterService: MonitorClientRouterService,
        private monitorMessageRouter: MonitorMessageRouterService,
        @Inject("fastRandom") private fastRandom: FastRandom,
    ) { }

    public async addClient(client: SocketClient) {
        const userData: UserData = await this.authService.getUserData<UserData>(client.handshake.query.token);
        this.clientRouterService.addClientToAccount(client.client.id, `${userData.userId}`);
    }

    public removeClient(client: SocketClient) {
        this.clientRouterService.removeClient(client.client.id);
        this.monitorMessageRouter.sendMessage({
            id: this.fastRandom.nextInt(),
            clientId: client.client.id,
            type: RequestType.unSubscribe,
        });
    }

    public getClientSubject(client: SocketClient) {
        return this.clientRouterService.getClientSubject(client.client.id);
    }

    public sendRequest(client: SocketClient, data: any) {
        const request: Request = { ...data };
        request.id = this.fastRandom.nextInt();
        request.clientId = client.client.id;
        this.monitorMessageRouter.sendMessage(request);
    }

}
