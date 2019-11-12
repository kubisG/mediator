import { IoAdapter } from "@nestjs/platform-socket.io";

export class RedisIoAdapter extends IoAdapter {

    protected redisAdapter;

    setAdapter(redisAdapter) {
        this.redisAdapter = redisAdapter;
    }

    createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, {
            ...options,
            transports: ["websocket", "polling"],
        });
        server.adapter(this.redisAdapter);
        return server;
    }

}
