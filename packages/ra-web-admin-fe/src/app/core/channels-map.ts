import { Subject } from "rxjs/internal/Subject";

interface SubjectMap { [key: string]: Subject<any>; }

export class ChannelsMap {

    private channelsMap: { [key: string]: SubjectMap } = {};

    public setChannelMethod(channelId: string, method: string): Subject<any> {
        if (this.channelsMap[channelId]) {
            const channelMap = this.channelsMap[channelId];
            channelMap[method] = channelMap[method] ? channelMap[method] : new Subject<any>();
        } else {
            this.channelsMap[channelId] = {};
            this.channelsMap[channelId][method] = new Subject<any>();
        }
        return this.channelsMap[channelId][method];
    }

    public getChannelMethod(channelId: string, method: string): Subject<any> {
        return this.setChannelMethod(channelId, method);
    }

}
