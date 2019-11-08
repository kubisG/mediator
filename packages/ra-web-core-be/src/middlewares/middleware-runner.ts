import { MessageMiddleware } from "./message-middleware.interface";
import { Logger } from "../logger/providers/logger";
import { ContextMiddlewareInterface } from "./context-middleware.interface";
import { NoDataError } from "./no-data-error";

export class MiddlewareRunner {

    constructor(
        private logger: Logger,
    ) { }

    private middlewares: MessageMiddleware[] = [];

    public add(mid: MessageMiddleware) {
        this.middlewares.push(mid);
    }

    public setMiddlewares(mids: MessageMiddleware[]) {
        this.middlewares = mids;
    }

    public async runOnly(data: any, context: ContextMiddlewareInterface, runMid: string[]) {
        for (const middleware of this.middlewares) {
            if (runMid.indexOf(middleware.constructor.name) > -1) {
                this.logger.debug(`${context.id} RUNNING ${middleware.constructor.name} MIDDLEWARE`);
                data = await middleware.resolve(data, context);
                if (!data) {
                    throw new NoDataError(`${middleware.constructor.name} MIDDLEWARE return ${data}`);
                }
            }
        }
        return data;
    }

    public async run(data: any, context: ContextMiddlewareInterface) {
        this.logger.silly(`${context.id} ----START MIDDLEWARE RUNNER----`);
        const runMid = data.runMid ? data.runMid : [];
        delete data.runMid;
        if (runMid.length > 0) {
            return this.runOnly(data, context, runMid);
        }
        for (const middleware of this.middlewares) {
            this.logger.silly(`${context.id} RUNNING ${middleware.constructor.name} MIDDLEWARE`);
            data = await middleware.resolve(data, context);
            if (!data && context.finish && context.finish === true) {
                return;
            }
            if (!data) {
                throw new NoDataError(`${middleware.constructor.name} MIDDLEWARE return ${data}`);
            }
        }
        this.logger.silly(`${context.id} ----END MIDDLEWARE RUNNER----`);
        return data;
    }

}
