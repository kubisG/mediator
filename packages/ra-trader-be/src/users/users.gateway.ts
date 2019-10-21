import { WebSocketGateway, SubscribeMessage } from "@nestjs/websockets";
import { UsersService } from "./users.service";

@WebSocketGateway({
    namespace: "users",
})
export class UsersGateway {

    constructor(
        private userService: UsersService,
    ) { }

    @SubscribeMessage("init")
    public onInit(client, data) {
        return this.userService.init(client.handshake.query.token);
    }
}
