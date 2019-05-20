import { ClientRouter } from "./client-router.interface";

export interface MessageRouter {

    setClientRouter(clientRouter: ClientRouter);

    consumeMessages(...args: any[]);

    sendMessage(msg: any, ...args: any[]): Promise<boolean>;

}
