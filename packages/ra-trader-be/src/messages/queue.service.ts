import { Injectable } from "@nestjs/common";

@Injectable()
export class QueueService {

    private messages: { [key: string]: { queue: any[] } } = {};

    constructor() {
    }

    public addToQueue(message: any, context: any): boolean {
        if (!message.RaID) {
            return true;
        }
        const id = context.app + "A" + message.RaID;
        let result = false;
        if (!this.messages[id]) {
            this.messages[id] = { queue: [] };
            result = true;
            this.messages[id].queue.push({ message, context });
        // resended message
        } else if ((this.messages[id].queue.length > 0) && (message.current)) {
            result = true;
        } else {
            this.messages[id].queue.push({ message, context });
        }
        return result;
    }

    public runFromQueue(message: any, context: any): any {
        if (!message.RaID) {
            return;
        }
        const id = context.app + "A" + message.RaID;

        if ((this.messages[id]) && (this.messages[id].queue) && (this.messages[id].queue.length > 1)) {
            // if we have more messages, return next and keep it in array
            const current = this.messages[id].queue.shift();
            const next = { ...this.messages[id].queue[0] };
            next.message.current = true;
            return next;
        } else {
            // clear queue
            delete this.messages[id];
        }
        return;
    }

}
