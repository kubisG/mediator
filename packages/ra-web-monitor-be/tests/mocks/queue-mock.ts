import { Queue } from "@ra/web-queue/dist/providers/queue.interface";
import { Observable } from "rxjs/internal/Observable";
import { ReplaySubject } from "rxjs/internal/ReplaySubject";
import { Subject } from "rxjs/internal/Subject";

export class QueueMock implements Queue {

    private sendedMessages: ReplaySubject<any> = new ReplaySubject(1);
    public sendedMessages$: Observable<any> = this.sendedMessages.asObservable();

    private consumeSubjects: { [key: string]: Subject<any> } = {};
    private consumeSubjects$: { [key: string]: Observable<any> } = {};

    connect() {

    }

    close() {

    }

    getSubjects(): { [key: string]: Observable<any> } {
        return this.consumeSubjects$;
    }

    createConsumers(queue: string) {

    }

    createQueue(queue: string) {

    }

    sendToQueue(msg: any, queue?: string): Promise<boolean> {
        this.sendedMessages.next(msg);
        return Promise.resolve(true);
    }

    consumeQueue(queue?: string): Observable<any> {
        const queueName = queue ? queue : "queue";
        this.consumeSubjects[queueName] = new Subject();
        this.consumeSubjects$[queueName] = this.consumeSubjects[queueName].asObservable();
        return this.consumeSubjects$[queueName];
    }

    ack(fields: any) {

    }

    nack(fields: any) {

    }


}
