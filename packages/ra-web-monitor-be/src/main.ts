import * as _ from "lodash";
import * as cluster from "cluster";
import * as dotenv from "dotenv";
import * as pkginfo from "pkginfo";
import * as morgan from "morgan";

import { FastifyAdapter } from "@nestjs/platform-fastify";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";

import { RedisIoAdapter } from "@ra/web-core-be/dist/redis-io-adapter";
import * as redisIoAdapter from "socket.io-redis";

dotenv.config();

export const closeHandlers: (() => Promise<void>)[] = [];

let app;

async function bootstrap() {
    const redisAdapter = redisIoAdapter({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT });
    const fastify = new FastifyAdapter();
    fastify.use(morgan("dev"));

    app = await NestFactory.create(AppModule, fastify);
    const wsAdapter = new RedisIoAdapter(app);
    wsAdapter.setAdapter(redisAdapter);
    app.useWebSocketAdapter(wsAdapter);

    app.setGlobalPrefix("/api/v1");
    console.log("process.env.NODE_ENV", process.env.NODE_ENV);
    if (EnvironmentService.instance.cors.origin.length > 0) {
        app.enableCors({
            origin: EnvironmentService.instance.cors.origin,
            credentials: true,
        });
    } else {
        console.log("NO CORS");
    }

    await app.listen(
        EnvironmentService.instance.appPort, "0.0.0.0", () => console.log(
            `Application is listening on port ${EnvironmentService.instance.appPort}`,
        ),
    );
}

async function workerBootstrap() {

}

function isPm2() {
    return process.env.pm_id !== undefined;
}

function isMaster() {
    console.log("IS PM2 master: " + (isPm2() && process.env.APP_MODE === "master"));
    if (isPm2() && process.env.APP_MODE === "master") {
        return true;
    } else if (cluster.isMaster) {
        return true;
    }
    return false;
}

function startApp() {
    pkginfo(module);
    if (isMaster()) {
        console.log("STARTING MASTER PROCESS");
        bootstrap();
    } else {
        console.log("STARTING WORKER PROCESS");
        workerBootstrap();
    }
}

console.log("process.env.pm_id:" + process.env.pm_id);
console.log("process.env.NODE_ENV:" + process.env.NODE_ENV);
console.log("process.env.APP_MODE:" + process.env.APP_MODE);

startApp();
