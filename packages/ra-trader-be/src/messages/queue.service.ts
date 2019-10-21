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
        } else {
            this.messages[id].queue.push({ message, context });
        }
        console.log("ADDTOQUEUE,", this.messages);
        return result;
    }


    public runFromQueue(message: any, context: any): any {
        if (!message.RaID) {
            return;
        }
        const id = context.app + "A" + message.RaID;

        console.log("id", id);
        console.log("FROMQUEUE,", this.messages);

        if ((this.messages[id]) && (this.messages[id].queue) && (this.messages[id].queue.length > 0)) {
            // if we have more messages, return next
            const next = this.messages[id].queue.shift();
            if (this.messages[id].queue.length === 0) {
                delete this.messages[id];
            }
            return next;
        } else {
            // clear queue
            delete this.messages[id];
        }
        return;
    }


}
