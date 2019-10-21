import * as _ from "lodash";
import * as cluster from "cluster";
import * as dotenv from "dotenv";
import * as pkginfo from "pkginfo";
import * as morgan from "morgan";

import { FastifyAdapter } from "@nestjs/platform-fastify";
import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { WorkersModule } from "./workers/workers.module";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

let app;
let appMicro;
let clusterfork;

async function bootstrap() {
    const fastify = new FastifyAdapter();
    fastify.use(morgan("dev"));

    app = await NestFactory.create(AppModule, fastify);
    app.setGlobalPrefix("/api/v1");
    app.enableCors({
        origin: EnvironmentService.instance.cors.origin,
        credentials: true,
    });
    // // if (!EnvironmentService.instance.production) {
    // console.log("SWAGGER INIT");
    // const options = new DocumentBuilder()
    //     .setTitle("RA Order Manager")
    //     .setDescription("API")
    //     .setVersion(module.exports.version)
    //     .setBasePath("/api/v1")
    //     .addBearerAuth("Authorization", "header")
    //     .addTag("Trader")
    //     .build();
    // const document = SwaggerModule.createDocument(app, options);
    // SwaggerModule.setup("api", app, document);
    // }

    await app.listen(
        EnvironmentService.instance.appPort, "0.0.0.0", () => console.log(
            `Application is listening on port ${EnvironmentService.instance.appPort}`
        )
    );
}

async function workerBootstrap() {
    // const connectioString = `amqp://${EnvironmentService.instance.queue.opt.trader.user}`
    //     + `:${EnvironmentService.instance.queue.opt.trader.password}`
    //     + `@${EnvironmentService.instance.queue.opt.trader.host}`
    //     + `:${EnvironmentService.instance.queue.opt.trader.port}`;
    appMicro = await NestFactory.createMicroservice(WorkersModule, {
        transport: Transport.REDIS,
        options: {
            url: `redis://${EnvironmentService.instance.redis.host}:${EnvironmentService.instance.redis.port}`,
            // urls: [connectioString],
            // queue: EnvironmentService.instance.queue.workersQ,
        }
    });
    appMicro.listen(() => console.log("Microservice is listening"));
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

function shutDown() {
    try {
        // Promise.all(closeHandlers).then(() => {
        //     console.log("HANDLERS OK");
        // });
        // if (app && isMaster()) {
        //     // app.close();
        //     app = undefined;
        //     clusterfork.kill("SIGKILL");
        // }
    } catch (ex) {
        console.log(ex);
    }
    try {
        // if (appMicro && !isMaster()) {
        //     // appMicro.close();
        //     appMicro = undefined;
        // }
    } catch (ex) {
        console.log(ex);
    }
}

function startApp() {
    pkginfo(module);
    if (isMaster()) {
        console.log("STARTING MASTER PROCESS");
        bootstrap();

        if (!isPm2()) {
            clusterfork = cluster.fork();
            cluster.on("exit", (worker, code, signal) => {
                console.log(`worker ${worker.process.pid} died`);
                // kill the other workers.
                for (const id in cluster.workers) {
                    if (id) {
                        cluster.workers[id].kill();
                    }
                }
                // exit the master process
                process.exit(0);
            });
        }

    } else {
        console.log("STARTING WORKER PROCESS");
        workerBootstrap();
    }
}

function loadEnv() {
    dotenv.config();
}

console.log("process.env.pm_id:" + process.env.pm_id);
console.log("process.env.NODE_ENV:" + process.env.NODE_ENV);
console.log("process.env.APP_MODE:" + process.env.APP_MODE);

loadEnv();
startApp();

// process.on("SIGTERM", () => { console.log("SIGTERM"); shutDown(); });
// process.on("SIGINT", () => { console.log("SIGINT"); shutDown(); });
// process.on("SIGUSR1", () => { console.log("SIGUSR1"); shutDown(); });
// process.on("SIGUSR2", () => { console.log("SIGUSR2"); shutDown(); });

process
    .on("unhandledRejection", (reason, p) => {
        console.error(reason, "Unhandled Rejection at Promise", p);
    })
    .on("uncaughtException", err => {
        console.error(err, "Uncaught Exception thrown");
    });
