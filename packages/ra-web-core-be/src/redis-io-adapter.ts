import { IoAdapter } from "@nestjs/platform-socket.io";

export class RedisIoAdapter extends IoAdapter {

    protected redisAdapter;

    public setAdapter(redisAdapter) {
        this.redisAdapter = redisAdapter;
    }

    public createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, options);
        server.adapter(this.redisAdapter);
        return server;
    }

}
