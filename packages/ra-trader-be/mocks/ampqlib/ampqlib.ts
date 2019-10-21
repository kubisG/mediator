import { Channel, Connection, Options, connect, Replies, Message, ConfirmChannel } from "amqplib";
import { mock, instance, when, verify } from "ts-mockito";
import * as Promise from "bluebird";
import { Subject } from "rxjs/internal/Subject";
import { EnvironmentService } from "../../src/environments/environment.service";
import { Observable } from "rxjs/internal/Observable";

export class AmpqChannelMock implements Channel {

    private queues: { [key: string]: Subject<any> } = {};

    constructor(private env: EnvironmentService) {
        this.init();
    }

    private init() {
        this.queues[this.env.queue.opt.trader.qTrader] = new Subject<any>();
        this.queues[this.env.queue.opt.trader.qBroker] = new Subject<any>();

        this.queues[this.env.queue.opt.trader.qTrader].asObservable().subscribe((data) => {
            this.queues[data.TargetCompID].next(data);
        });

        this.queues[this.env.queue.opt.trader.qBroker].subscribe((data) => {
            this.queues[data.TargetCompID].next(data);
        });
    }

    close(): Promise<void> {
        return;
    }
    assertQueue(queue: string, options?: Options.AssertQueue): Promise<Replies.AssertQueue> {
        if (!this.queues[queue]) {
            this.queues[queue] = new Subject<any>();
        }
        return Promise.resolve({
            queue,
            messageCount: 0,
            consumerCount: 0,
        });
    }
    checkQueue(queue: string): Promise<Replies.AssertQueue> {
        throw new Error("Method not implemented.");
    }
    deleteQueue(queue: string, options?: Options.DeleteQueue): Promise<Replies.DeleteQueue> {
        throw new Error("Method not implemented.");
    }
    purgeQueue(queue: string): Promise<Replies.PurgeQueue> {
        throw new Error("Method not implemented.");
    }
    bindQueue(queue: string, source: string, pattern: string, args?: any): Promise<Replies.Empty> {
        throw new Error("Method not implemented.");
    }
    unbindQueue(queue: string, source: string, pattern: string, args?: any): Promise<Replies.Empty> {
        throw new Error("Method not implemented.");
    }
    assertExchange(exchange: string, type: string, options?: Options.AssertExchange): Promise<Replies.AssertExchange> {
        throw new Error("Method not implemented.");
    }
    checkExchange(exchange: string): Promise<Replies.Empty> {
        throw new Error("Method not implemented.");
    }
    deleteExchange(exchange: string, options?: Options.DeleteExchange): Promise<Replies.Empty> {
        throw new Error("Method not implemented.");
    }
    bindExchange(destination: string, source: string, pattern: string, args?: any): Promise<Replies.Empty> {
        throw new Error("Method not implemented.");
    }
    unbindExchange(destination: string, source: string, pattern: string, args?: any): Promise<Replies.Empty> {
        throw new Error("Method not implemented.");
    }
    publish(exchange: string, routingKey: string, content: Buffer, options?: Options.Publish): boolean {
        this.queues[routingKey].next(JSON.parse(content.toString()));
        return true;
    }
    sendToQueue(queue: string, content: Buffer, options?: Options.Publish): boolean {
        this.queues[queue].next(JSON.parse(content.toString()));
        return true;
    }
    consume(queue: string, onMessage: (msg: Message) => any, options?: Options.Consume): Promise<Replies.Consume> {
        this.assertQueue(queue);
        this.queues[queue].asObservable().subscribe((data) => {
            onMessage({
                content: Buffer.from(JSON.stringify(data)),
                fields: {
                    deliveryTag: 0,
                    redelivered: false,
                    exchange: null,
                    routingKey: null,
                    messageCount: "1",
                },
                properties: null,
            });
        });
        return Promise.resolve({ consumerTag: queue });
    }
    cancel(consumerTag: string): Promise<Replies.Empty> {
        throw new Error("Method not implemented.");
    }
    get(queue: string, options?: Options.Get): Promise<false | Message> {
        throw new Error("Method not implemented.");
    }
    ack(message: Message, allUpTo?: boolean): void {

    }
    ackAll(): void {
        throw new Error("Method not implemented.");
    }
    nack(message: Message, allUpTo?: boolean, requeue?: boolean): void {
        throw new Error("Method not implemented.");
    }
    nackAll(requeue?: boolean): void {
        throw new Error("Method not implemented.");
    }
    reject(message: Message, requeue?: boolean): void {
        throw new Error("Method not implemented.");
    }
    prefetch(count: number, global?: boolean): Promise<Replies.Empty> {
        throw new Error("Method not implemented.");
    }
    recover(): Promise<Replies.Empty> {
        throw new Error("Method not implemented.");
    }
    addListener(event: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    on(event: string | symbol, listener: (...args: any[]) => void): this {
        return this;
    }
    once(event: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    prependListener(event: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    removeAllListeners(event?: string | symbol): this {
        throw new Error("Method not implemented.");
    }
    setMaxListeners(n: number): this {
        throw new Error("Method not implemented.");
    }
    getMaxListeners(): number {
        throw new Error("Method not implemented.");
    }
    listeners(event: string | symbol): Function[] {
        throw new Error("Method not implemented.");
    }
    rawListeners(event: string | symbol): Function[] {
        throw new Error("Method not implemented.");
    }
    emit(event: string | symbol, ...args: any[]): boolean {
        throw new Error("Method not implemented.");
    }
    eventNames(): (string | symbol)[] {
        throw new Error("Method not implemented.");
    }
    listenerCount(type: string | symbol): number {
        throw new Error("Method not implemented.");
    }


}

export class AmpqConfirmChannelMock extends AmpqChannelMock {

    private confirms: Subject<any> = new Subject<void>();
    private confirms$: Observable<void> = this.confirms.asObservable();

    publish(
        exchange: string,
        routingKey: string,
        content: Buffer,
        options?: Options.Publish,
        callback?: (err: any, ok: Replies.Empty) => void
    ): boolean {
        const res = super.publish(exchange, routingKey, content, options);
        if (callback) {
            callback(null, undefined);
        }
        return res;
    }

    sendToQueue(queue: string, content: Buffer, options?: Options.Publish, callback?: (err: any, ok: Replies.Empty) => void): boolean {
        const res = super.sendToQueue(queue, content, options);
        if (callback) {
            callback(null, undefined);
        }
        this.confirms.next();
        return res;
    }

    waitForConfirms(): Promise<void> {
        return Promise.resolve();
    }

}

export class AmpqConnectionMock implements Connection {

    constructor(private env: EnvironmentService) {

    }

    close(): Promise<void> {
        return;
    }
    createChannel(): Promise<Channel> {
        return Promise.resolve(new AmpqChannelMock(this.env));
    }
    createConfirmChannel(): Promise<ConfirmChannel> {
        return Promise.resolve(new AmpqConfirmChannelMock(this.env));
    }
    addListener(event: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    on(event: string | symbol, listener: (...args: any[]) => void): this {
        return this;
    }
    once(event: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    prependListener(event: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    removeAllListeners(event?: string | symbol): this {
        throw new Error("Method not implemented.");
    }
    setMaxListeners(n: number): this {
        throw new Error("Method not implemented.");
    }
    getMaxListeners(): number {
        throw new Error("Method not implemented.");
    }
    listeners(event: string | symbol): Function[] {
        throw new Error("Method not implemented.");
    }
    rawListeners(event: string | symbol): Function[] {
        throw new Error("Method not implemented.");
    }
    emit(event: string | symbol, ...args: any[]): boolean {
        throw new Error("Method not implemented.");
    }
    eventNames(): (string | symbol)[] {
        throw new Error("Method not implemented.");
    }
    listenerCount(type: string | symbol): number {
        throw new Error("Method not implemented.");
    }


}
