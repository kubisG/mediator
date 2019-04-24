import { MessagesRouter } from "../../messages/routing/messages-router";

export interface ContextMiddlewareInterface {
    messageRouter: MessagesRouter;
    userData?: any;
    app: number;
    queue: string;
    [key: string]: any;
}
