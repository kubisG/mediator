import { Queue } from "@ra/web-queue/providers/queue.interface";
import { Logger } from "@ra/web-core-be/logger/providers/logger";
import { MiddlewareRunner } from "@ra/web-core-be/middlewares/middleware-runner";
import { MessageMiddleware } from "@ra/web-core-be/middlewares/message-middleware.interface";
import { MessageRouter } from "./interfaces/message-router.interface";
import { ClientRouter } from "./interfaces/client-router.interface";

export abstract class BaseMessageRouter<T, R> implements MessageRouter {

    protected requestQueue: string;

    private middlewareRunnerIn = new MiddlewareRunner(this.logger);
    private middlewareRunnerOut = new MiddlewareRunner(this.logger);

    constructor(
        public queue: Queue,
        public clientRouter: ClientRouter,
        protected logger: Logger,
        protected inMiddlewares?: MessageMiddleware[],
        protected outMiddlewares?: MessageMiddleware[],
    ) {
        this.inMiddlewares = this.inMiddlewares ? this.inMiddlewares : [];
        this.outMiddlewares = this.outMiddlewares ? this.outMiddlewares : [];
        this.middlewareRunnerIn.setMiddlewares(this.inMiddlewares);
        this.middlewareRunnerOut.setMiddlewares(this.outMiddlewares);
    }

    protected abstract routeMessage(msg: T);

    public setInMiddlewares(mids: MessageMiddleware[]) {
        this.middlewareRunnerIn.setMiddlewares(mids);
    }

    public setOutMiddlewares(mids: MessageMiddleware[]) {
        this.middlewareRunnerOut.setMiddlewares(mids);
    }

    public setRequestQueue(queue: string) {
        this.requestQueue = queue;
    }

    public setClientRouter(clientRouter: ClientRouter) {
        this.clientRouter = clientRouter;
    }

    public consumeMessages(queue: string) {
        this.queue.consumeQueue(queue).subscribe((msg: T) => {
            this.middlewareRunnerIn.run(msg, { queue }).then((data) => {
                this.routeMessage(data);
            }).catch((err) => {
                this.logger.error(err);
            });
        });
    }

    public sendMessage(msg: R): Promise<boolean> {
        return this.middlewareRunnerOut.run(msg, { queue: this.requestQueue }).then((data) => {
            return this.queue.sendToQueue(data, this.requestQueue);
        }).catch((err) => {
            return false;
        });
    }

}
