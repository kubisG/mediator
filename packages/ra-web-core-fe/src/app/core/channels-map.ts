import { ReplaySubject } from "rxjs/internal/ReplaySubject";

interface SubjectMap { [key: string]: ReplaySubject<any>; }

export class ChannelsMap {

    private channelsMap: { [key: string]: SubjectMap } = {};

    public setChannelMethod(channelId: string, method: string): ReplaySubject<any> {
        if (this.channelsMap[channelId]) {
            const channelMap = this.channelsMap[channelId];
            channelMap[method] = channelMap[method] ? channelMap[method] : new ReplaySubject<any>(1);
        } else {
            this.channelsMap[channelId] = {};
            this.channelsMap[channelId][method] = new ReplaySubject<any>(1);
        }
        return this.channelsMap[channelId][method];
    }

    public getChannelMethod(channelId: string, method: string): ReplaySubject<any> {
        return this.setChannelMethod(channelId, method);
    }

}
