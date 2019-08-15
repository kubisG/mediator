import * as _ from "lodash";

export class MessageValidatorService {

    private filter: { [key: string]: { required: string[], optional: string[] } } = {};

    public setFilter(filter: any) {
        this.filter = filter;
    }

    public isMessageValid(message: any) {
        if (!this.filter[message.RequestType + "-" + message.msgType]) {
            return true;
        }
        const diff = _.difference(this.filter[message.RequestType + "-" + message.msgType].required, Object.keys(message));
        return diff.length === 0;
    }

    public getMessageDiff(message: any): any[] {
        return _.difference(this.filter[message.RequestType + "-" + message.msgType].required, Object.keys(message));
    }

    public async treatMessage(message: any): Promise<any> {
        if (!this.isMessageValid(message)) {
            const diff = _.difference(this.filter[message.RequestType + "-" + message.msgType].required, Object.keys(message));
            throw new Error(`Missing attributes ${diff.join(",")}`);
        }
        if (this.filter[message.RequestType + "-" + message.msgType]) {
            const diff = _.difference(Object.keys(message), this.filter[message.RequestType + "-" + message.msgType].required
                , this.filter[message.RequestType + "-" + message.msgType].optional);
            for (let i = 0; i < diff.length; i++) {
                delete message[diff[i]];
            }
        }
        Object.keys(message).forEach(key => {
            if (message[key] === null || message[key] === "" || message[key] === undefined) {
                delete message[key];
            }
        });
        return message;
    }

}
