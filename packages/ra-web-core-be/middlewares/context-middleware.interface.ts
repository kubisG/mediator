export interface ContextMiddlewareInterface {
    messageRouter: any;
    userData?: any;
    app: number;
    queue: string;
    [key: string]: any;
}
