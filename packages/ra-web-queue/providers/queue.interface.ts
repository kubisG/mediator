import { Observable } from "rxjs/internal/Observable";

export interface Queue {
    connect();
    close();

    getSubjects(): { [key: string]: Observable<any> };

    createConsumers(queue: string);
    createQueue(queue: string);

    sendToQueue(msg: any, queue?: string): Promise<boolean>;
    consumeQueue(queue?: string): Observable<any>;

    ack(fields: any);
    nack(fields: any);

}
