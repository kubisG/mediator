import { ContextMiddlewareInterface } from "./context-middleware.interface";

export interface MessageMiddleware {

    resolve(data: any, context: ContextMiddlewareInterface): Promise<any>;

}
