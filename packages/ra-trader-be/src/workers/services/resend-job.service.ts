import * as redis from "redis";
import { Injectable, Inject } from "@nestjs/common";
import { Cron, Interval, NestSchedule } from "@nestcloud/schedule";
import { Observable, BehaviorSubject } from "rxjs";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { Connection } from "typeorm";
import { OrderStoreRepository } from "../../dao/repositories/order-store.repository";
import { MessageRepository } from "../../dao/repositories/message.repository";

@Injectable()
export class ReSendJobService extends NestSchedule {

    private intervalIterator = 0;
    private running = false;

    private subscribers: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    public subscribers$: Observable<any> = this.subscribers.asObservable();

    private redisClient;

    constructor(
        @Inject("orderStoreRepository") private orderStoreRepository: OrderStoreRepository,
        @Inject("messageRepository") private messageRepository: MessageRepository,
        private env: EnvironmentService,
        @Inject("logger") private logger: Logger,
    ) {
        super();
        this.redisClient = redis.createClient(this.env.redis.port, this.env.redis.host);
        this.redisClient.on("error", (error) => {
            this.logger.error(error);
        });
    }

    private async getUnsent() {
        this.running = true;
        this.messageRepository.find({ sended: 1 }).then((messages) => {
            messages.forEach((message) => {
                this.subscribers.next(message);
                this.redisClient.publish(`resend_${message.app}`, JSON.stringify(message));
            });
            this.running = false;
        });
    }

    @Interval(1000)
    public runJob() {
        if (this.intervalIterator === this.env.worker.resending && !this.running) {
            this.getUnsent();
            this.intervalIterator = 0;
        }
        this.intervalIterator++;
    }

}
