import { SessionStore } from "@ra/web-core-be/dist/sessions/providers/session-store.interface";

export class SessionsStoreMock implements SessionStore {

    data = {};

    constructor(
    ) {
    }

    public set(sid: string, data: any) {
        this.data[sid] = JSON.stringify(data);
    }

    public async get(sid: string) {
        return this.data[sid];
    }

    public close() {
    }

    destroy(sid: string) {
        delete  this.data[sid];
    }
}
