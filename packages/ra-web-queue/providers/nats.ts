import * as NATS from "nats";

import { Options } from "amqplib";
import { Queue } from "./queue.interface";
import { Logger } from "@ra/web-core-be/logger/providers/logger";
import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";
import { QueueConnectionError } from "../errors/queue-connection-error";

export class Nats implements Queue {

    private connection: NATS.Client;

    private consumeSubjects: { [key: string]: Subject<any> } = {};
    private consumeSubjects$: { [key: string]: Observable<any> } = {};

    private initializedConsumers: string[] = [];
    private initializedConsumersChannel: any[] = [];

    private connectionReady = false;
    private channelReady = false;

    private reconnectionRunning = false;

    constructor(
        private logger: Logger,
        private config: Options.Connect,
    ) { }

    private bindConnectionEvents(connection: NATS.Client) {
        connection.on("close", () => {
            this.logger.warn("NATS CONNECTION CLOSED");
            this.connectionReady = false;
            this.reConnect();
        });
        connection.on("error", (err) => {
            this.logger.error("NATS CONNECTION ERROR:", err);
            this.connectionReady = false;
            this.reConnect();
        });
        connection.on("disconnect", (reason) => {
            this.logger.warn("NATS CONNECTION DISCONNECTED:", reason);
            this.connectionReady = false;
        });
        connection.on("reconnect", () => {
            this.logger.warn("NATS CONNECTION RECONNECTED");
        });
        connection.on("reconnecting", () => {
            this.logger.warn("NATS CONNECTION RECONNECTING");
        });        
    }

    private async createConnection() {
        this.connection = await this.getConnection(this.config);
        this.bindConnectionEvents(this.connection);
        this.logger.info("CONNECTED TO NATS");
        this.connectionReady = true;
    }
    private async createChannel() {
        this.logger.info("CHANNEL TO NATS");
        this.channelReady = true;
    }

    private consumeChannel(queue: string) {
        this.initializedConsumersChannel[queue] = this.connection.subscribe(queue, (msg) => {
            if (msg !== null) {
                const mess = JSON.parse(msg.content.toString());
                this.consumeSubjects[queue].next({
                    ...mess
                });
            }
        });
    }

    private reConnect() {
        if (this.reconnectionRunning) {
            return;
        }
        this.reconnectionRunning = true;
        setTimeout((instance) => {
            instance.createConnections().then(() => {
                this.logger.info(`NATS: RECONNECTING`);
                instance.reconsumeChannel();
                instance.reconnectionRunning = false;
            }).catch((err) => {
                instance.logger.error(err);
                instance.reconnectionRunning = false;
                instance.reConnect();
            });
        }, 5000, this);
    }

    private unsubscribeChannel(queue) {
        const channel = this.initializedConsumersChannel[queue];
        this.connection.unsubscribe(channel);
    }

    public reconsumeChannel() {
        this.initializedConsumers.forEach((queue) => {            
            this.logger.info(`NATS: RECONSUME CHANNEL: ${queue}`);
            this.unsubscribeChannel(queue);
            this.consumeChannel(queue);
        });
    }

    public async getConnection(config: Options.Connect) {
        const servers = ["nats://" + config.hostname + ":" + config.port];
        return await NATS.connect({ "servers": servers, "user": config.username, "pass": config.password, "json": true });
    }

    public async createConnections() {
        try {
            await this.createConnection();
            await this.createChannel();
        } catch (ex) {
            await this.close();
            throw ex;
        }
    }

    public async connect() {
        try {
            await this.createConnections();
        } catch (ex) {
            this.logger.error(ex);
            await this.close();
        }
    }

    public async close() {
        if (this.channelReady && this.connectionReady) {
            await this.connection.close();
            this.connection = undefined;
        }
    }

    public getSubjects(): { [key: string]: Observable<any> } {
        return this.consumeSubjects$;
    }
    /**
     *
     * @param msg
     * @param queue
     */
    public async sendToQueue(msg: any, queue: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.connection.publish(queue, Buffer.from(JSON.stringify(msg)), (err, ok) => {
                if (err) {
                    reject(new QueueConnectionError("RMQ sendToQueue error", err));
                    return;
                }
                resolve(true);
            });
        });
    }

    public createConsumers(queue: string): void {
        if (this.initializedConsumers.indexOf(queue) === -1) {
            this.initializedConsumers.push(queue);
            this.logger.info(`AMPQ: CREATING CONSUMER FOR: ${queue}`);
            this.consumeSubjects[queue] = new Subject<any>();
            this.consumeSubjects$[queue] = this.consumeSubjects[queue].asObservable();
            this.consumeChannel(queue);
        }
    }

    public ack(fields: any) {
        // dummy for NATS
    }

    public nack(fields: any) {
        // dummy for NATS
    }

    public async createQueue(queue: string) {
        // dummy for NATS
        return null;
    }    

    public consumeQueue(queue: string): Observable<any> {
        this.createConsumers(queue);
        return this.consumeSubjects$[queue];
    }

}
