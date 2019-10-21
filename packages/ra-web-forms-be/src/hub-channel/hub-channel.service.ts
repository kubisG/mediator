import { Injectable, Inject } from "@nestjs/common";
import { HubMessageRouterService } from "./hub-channel-message-router.service";
import { RequestType } from "./dto/request/request-type.enum";
import { Request } from "./dto/request/request.interface";
import { FastRandom } from "@ra/web-core-be/dist/fast-random.interface";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { UserData } from "@ra/web-shared-be/src/users/user-data.interface";
import { HubClientRouterService } from "./hub-client-router.service";
import { SocketClient } from "@ra/web-core-be/dist/interfaces/socket-client.interface";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { AdvancedConsoleLogger } from "typeorm";

@Injectable()
export class HubChannelService {

    constructor(
        private hubMessageRouter: HubMessageRouterService,
        private authService: AuthService,
        private clientRouterService: HubClientRouterService,
        @Inject("fastRandom") private fastRandom: FastRandom,
        private env: EnvironmentService,
    ) {
        this.sendSubscribe(this.env.queue.opt.nats.locatesId);
    }

    public sendSubscribe(client: string) {
        const request: Request = {
            id: this.fastRandom.nextInt(),
            clientId: client,
            type: RequestType.locates,
        };
        this.hubMessageRouter.sendMessage(request);
    }

    public async addClient(client: SocketClient) {
        if (client.handshake.query.token) {
            const userData: UserData = await this.authService.getUserData<UserData>(client.handshake.query.token);
            this.clientRouterService.addClientToAccount(client.client.id, `COMP${userData.compId}`);
        }
    }

    public removeClient(client: SocketClient) {
        this.clientRouterService.removeClient(client.client.id);
    }

    public getClientSubject(client: SocketClient) {
        return this.clientRouterService.getClientSubject(client.client.id);
    }

    public sendTests() {
        // const request: Request = {
        //     id: this.fastRandom.nextInt(),
        //     clientId: this.env.queue.opt.nats.locatesId,
        //     type: RequestType.locates,
        //     data: [{recordId: 1, usedQuantity: 100 }],
        // };

        const request: any = {
            id: this.fastRandom.nextInt(),
            clientId: this.env.queue.opt.nats.locatesId,
            type: "clearLocates",
        };

        this.hubMessageRouter.sendMessage(request);
    }

}
