import { Injectable } from "@nestjs/common";
import * as net from "net";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";

@Injectable()
export class DiagnosticsService {

    constructor(
        private env: EnvironmentService,
    ) { }

    private testConnection(port: number, host: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const socket = net.connect(port, host, () => { });
            socket.on("connect", () => {
                socket.destroy();
                resolve(true);
            });
            socket.on("error", () => {
                socket.destroy();
                resolve(false);
            });
            socket.on("timeout", () => {
                socket.destroy();
                resolve(false);
            });
        });
    }

    public async getSystemStatus() {
        return [
            {
                name: "rabbitmq", status: await this.getRabbitMQStatus(),
                host: `${this.env.queue.opt.trader.host}:${this.env.queue.opt.trader.port}`
            },
            { name: "database", status: await this.getDatabaseStatus(), host: `${this.env.db.host}:${this.env.db.port}` },
            { name: "redis", status: await this.getRedisStatus(), host: `${this.env.redis.host}:${this.env.redis.port}` }
        ];
    }

    public async getRabbitMQStatus(): Promise<boolean> {
        return await this.testConnection(this.env.queue.opt.trader.port, this.env.queue.opt.trader.host);
    }

    public async getDatabaseStatus(): Promise<boolean> {
        return await this.testConnection(this.env.db.port, this.env.db.host);
    }

    public async getRedisStatus(): Promise<boolean> {
        return await this.testConnection(this.env.redis.port, this.env.redis.host);
    }

}
