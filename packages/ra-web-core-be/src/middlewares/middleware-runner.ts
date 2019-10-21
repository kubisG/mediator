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
        for (let i = 0; i < this.middlewares.length; i++) {
            if (runMid.indexOf(this.middlewares[i].constructor.name) > -1) {
                this.logger.debug(`${context.id} RUNNING ${this.middlewares[i].constructor.name} MIDDLEWARE`);
                data = await this.middlewares[i].resolve(data, context);
                if (!data) {
                    throw new NoDataError(`${this.middlewares[i].constructor.name} MIDDLEWARE return ${data}`);
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
            this.runOnly(data, context, runMid);
            return;
        }
        for (let i = 0; i < this.middlewares.length; i++) {
            this.logger.silly(`${context.id} RUNNING ${this.middlewares[i].constructor.name} MIDDLEWARE`);
            data = await this.middlewares[i].resolve(data, context);
            if ((!data) && (context.finish) && (context.finish === true)) {
                return;
            }
            if (!data) {
                throw new NoDataError(`${this.middlewares[i].constructor.name} MIDDLEWARE return ${data}`);
            }
        }
        this.logger.silly(`${context.id} ----END MIDDLEWARE RUNNER----`);
        return data;
    }

}
