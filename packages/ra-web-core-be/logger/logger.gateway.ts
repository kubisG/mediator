import { SubscribeMessage, WebSocketGateway, WsResponse } from "@nestjs/websockets";
import { FileLogger } from "./providers/file-logger";

@WebSocketGateway({
    namespace: "log",
})
export class LoggerGateway {

    private logger: FileLogger = new FileLogger();

    constructor() { }

    @SubscribeMessage("message")
    public onData(client, data) {
        this.logger.log(data.level, data.message);
    }
}
