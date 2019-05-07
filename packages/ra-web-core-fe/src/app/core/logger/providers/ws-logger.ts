import { Logger } from "./logger";
import { WebSocketService } from "../../websocket/services/websocket.service";
import { WebSocketSetup, WebSocketEvent } from "../../websocket/decorators/websocket-service.decorator";
import { Store, Actions } from "@ngxs/store";
@WebSocketSetup({ namespace: "log" })
export class WsLogger extends WebSocketService implements Logger {

    private enabled: boolean;

    constructor(
        store: Store,
        actions: Actions,
    ) {
        super(true, actions, store);
        this.init();
    }

    private init() {
        this.socketConnected$.subscribe((connected) => {
            if (connected) {
                this.emit("init", {});
            }
        });
    }

    public log(level: string, msg: any) {
        if (this.enabled) {
            this.emit("message", { level, message: msg });
        }
    }

    public error(msg: any): void {
        this.log("error", msg);
    }

    public warn(msg: any): void {
        this.log("warn", msg);
    }

    public info(msg: any): void {
        this.log("info", msg);
    }

    public verbose(msg: any): void {
        this.log("verbose", msg);
    }

    public debug(msg: any): void {
        this.log("debug", msg);
    }

    public silly(msg: any): void {
        this.log("silly", msg);
    }

    public enableLogging(enabled: boolean): void {
        this.enabled = enabled;
    }
}
