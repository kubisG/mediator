import { Injectable, Inject } from "@nestjs/common";
import { Subscription } from "rxjs/internal/Subscription";
import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { Queue } from "@ra/web-queue/dist/providers/queue.interface";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { StatusDto } from "./dto/status.dto";
import { ClientProxy, Closeable } from "@nestjs/microservices";

@Injectable()
export class HubService {

    private subscripions: { [key: string]: Subscription } = {};
    private initializedConsumers: string[] = [];

    private statusSubject: Subject<any> = new Subject<any>();
    public statusSubject$: Observable<any> = this.statusSubject.asObservable();

    constructor(
        private env: EnvironmentService,
        @Inject("queueBroker") public brokerQueue: Queue,
        @Inject("queueTrader") public traderQueue: Queue,
        @Inject("clientProxy") public clientProxy: ClientProxy & Closeable,
        @Inject("logger") private logger: Logger,
    ) {
        this.initStatusMessages();
    }

    public initStatusMessages() {
        this.createConsumers("Status").then(() => {
            if (!this.subscripions["Status"]) {
                this.logger.info(`STATUS ROUTER: CONNECTED TO CONSUME QUEUE: ${"Status"}`);
                this.subscripions["B" + "Status"] = this.brokerQueue.consumeQueue("Status").subscribe((msg) => {
                    if (msg.fields) {
                        this.brokerQueue.ack(msg.fields);
                    } else {
                        this.logger.warn(`TRY ACK FAILED ID: ${msg.id}`);
                    }
                    this.statusSubject.next({ type: "broker", msg });
                });
            }
        });

        this.createConsumers("Jobs").then(() => {
            if (!this.subscripions["Jobs"]) {
                this.logger.info(`STATUS ROUTER: CONNECTED TO CONSUME QUEUE: ${"Jobs"}`);
                this.subscripions["Jobs"] = this.brokerQueue.consumeQueue("Jobs").subscribe((msg) => {
                    if (msg.fields) {
                        this.logger.warn(`TRY ACK ID: ${msg.id}`);
                        this.brokerQueue.ack(msg.fields);
                    } else {
                        this.logger.warn(`TRY ACK FAILED ID: ${msg.id}`);
                    }

                    switch (msg.Text) {
                        case "Download": {
                            this.clientProxy.send<any>(
                                { cmd: "jobDownload" },
                                { msg },
                            ).subscribe((result) => {
                            });
                            break;
                        }
                        case "UpdateDFD": {
                            this.clientProxy.send<any>(
                                { cmd: "jobDfdUpdate" },
                                { msg },
                            ).subscribe((result) => {
                            });
                            break;
                        }
                        default: {
                        }
                    }
                });
            }
        });
    }

    public async createConsumers(queue: string) {
        if (this.initializedConsumers.indexOf(queue) === -1) {
            await this.brokerQueue.createQueue(queue);
            this.brokerQueue.createConsumers(queue);
            await this.traderQueue.createQueue(queue);
            this.traderQueue.createConsumers(queue);
            this.logger.info(`STATUS ROUTER: CREATING STATUS CONSUMER FOR: ${queue}`);
            this.initializedConsumers.push(queue);
        }

    }

    public getStatus(): Observable<StatusDto> {
        return new Observable((observer) => {
            this.statusSubject$.subscribe((message) => {
                observer.next(new StatusDto(message));
            });
        });
    }

}
