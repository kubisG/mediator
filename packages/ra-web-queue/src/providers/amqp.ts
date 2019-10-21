import { Connection, Options, connect, ConfirmChannel } from "amqplib";

import { Queue } from "./queue.interface";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";
import { QueueConnectionError } from "../errors/queue-connection-error";

export class Amqp implements Queue {

    private channel: ConfirmChannel;
    private connection: Connection;
    private driver: any;

    private consumeSubjects: { [key: string]: Subject<any> } = {};
    private consumeSubjects$: { [key: string]: Observable<any> } = {};

    private initializedConsumers: string[] = [];

    private connectionReady = false;
    private channelReady = false;

    private reconnectionRunning = false;

    constructor(
        private logger: Logger,
        private config: Options.Connect,
    ) { }

    private bindConnectionEvents(connection: Connection) {
        connection.on("close", () => {
            this.logger.warn("RMQ CONNECTION CLOSED");
            this.connectionReady = false;
            this.reConnect();
        });
        connection.on("error", (err) => {
            this.logger.error("RMQ CONNECTION ERROR:", err);
            this.connectionReady = false;
            this.reConnect();
        });
        connection.on("blocked", (reason) => {
            this.logger.warn("RMQ CONNECTION BLOCKED:", reason);
            this.connectionReady = false;
        });
        connection.on("unblocked", () => {
            this.logger.warn("RMQ CONNECTION UNBLOCKED");
        });
    }

    private bindChannelEvents(channel: ConfirmChannel) {
        channel.on("close", (err) => {
            this.logger.warn("RMQ CHANNEL CLOSED");
            this.channelReady = false;
            this.reConnect();
        });
        channel.on("error", (err) => {
            this.logger.error("RMQ CHANNEL ERROR:", err);
            this.channelReady = false;
            this.reConnect();
        });
        channel.on("return", (msg) => {
            this.logger.warn("RMQ CHANNEL MESSAGE RETURN", msg);
        });
        channel.on("drain", () => {
            this.logger.warn("RMQ CHANNEL DRAIN");
        });
    }

    private async createConnection() {
        this.connection = await this.getConnection(this.config);
        this.bindConnectionEvents(this.connection);
        this.logger.info("CONNECTED TO MQ");
        this.connectionReady = true;
    }

    private async createChannel() {
        this.channel = await this.connection.createConfirmChannel();
        this.bindChannelEvents(this.channel);
        this.logger.info("CHANNEL TO MQ");
        this.channelReady = true;
    }

    private getChannel() {
        if (!this.connectionReady || !this.channelReady) {
            throw new QueueConnectionError("RMQ Connection error");
        }
        return this.channel;
    }

    public sendInternalMsg(msg, queue): Promise<any> {
        if (this.consumeSubjects[queue]) {
            console.log("sending internal", msg);
            this.consumeSubjects[queue].next(msg);
            return Promise.resolve(true);
        }
        return Promise.reject(false);
    }

    private consumeChannel(queue: string, channel: ConfirmChannel) {
        channel.consume(queue, (msg) => {
            if (msg !== null) {
                const mess = JSON.parse(msg.content.toString());
                this.consumeSubjects[queue].next({
                    ...mess,
                    fields: msg.fields,
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
                this.logger.info(`AMPQ: RECONNECTING`);
                instance.reconsumeChannel();
                instance.reconnectionRunning = false;
            }).catch((err) => {
                instance.logger.error(err);
                instance.reconnectionRunning = false;
                instance.reConnect();
            });
        }, 5000, this);
    }

    public reconsumeChannel() {
        this.initializedConsumers.forEach((queue) => {
            this.logger.info(`AMPQ: RECONSUME CHANNEL: ${queue}`);
            this.createQueue(queue);
            this.consumeChannel(queue, this.getChannel());
        });
    }

    public setDriver(driver: (config: any) => Promise<Connection>) {
        this.driver = driver;
    }

    public async getConnection(config: Options.Connect) {
        return await (this.driver ? this.driver(config) : connect(config));
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
            await this.channel.close();
            this.channel = undefined;
            await this.connection.close();
            this.connection = undefined;
        }
    }

    public getSubjects(): { [key: string]: Observable<any> } {
        return this.consumeSubjects$;
    }

    public async createQueue(queue: string) {
        const channel = this.getChannel();
        return await channel.assertQueue(queue);
    }

    /**
     *
     * @param msg
     * @param queue
     */
    public async sendToQueue(msg: any, queue: string): Promise<any> {
        await this.createQueue(queue);
        const channel = this.getChannel();
        return new Promise((resolve, reject) => {
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)), { persistent: true }, (err, ok) => {
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
            const channel = this.getChannel();
            this.initializedConsumers.push(queue);
            this.logger.info(`AMPQ: CREATING CONSUMER FOR: ${queue}`);
            this.consumeSubjects[queue] = new Subject<any>();
            this.consumeSubjects$[queue] = this.consumeSubjects[queue].asObservable();
            this.consumeChannel(queue, channel);
        }
    }

    public ack(fields: any) {
        const channel = this.getChannel();
        channel.ack({ fields, content: null, properties: null });
    }

    public nack(fields: any) {
        const channel = this.getChannel();
        channel.nack({ fields, content: null, properties: null }, undefined, false);
    }

    public consumeQueue(queue: string): Observable<any> {
        this.createConsumers(queue);
        return this.consumeSubjects$[queue];
    }

}
