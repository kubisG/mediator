export interface SessionStore {
    set(sid: string, data: any);
    get(sid: string): Promise<any>;
    destroy(sid: string);
    close();
}
