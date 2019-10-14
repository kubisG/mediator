import { Injectable } from "@nestjs/common";
import * as config from "config";
import * as fs from "fs";

@Injectable()
export class EnvironmentService {

    private conf;

    constructor() {
        if (config.get) {
            this.conf = config;
        } else {
            this.conf = config.default;
        }
        // if (process.env.NODE_ENV === "test") {
        //     dotenv.config();
        // }
    }

    get production() {
        return this.conf.get("production");
    }

    get logging() {
        return {
            provider: this.conf.get("logging.provider"),
            remote: this.conf.get("logging.remote"),
            db: process.env.DB_LOGGING ? process.env.DB_LOGGING : this.conf.get("logging.db"),
        };
    }

    get appPort() {
        return this.conf.get("app.port");
    }

    get appVersion() {
        return this.conf.get("app.version");
    }

    get worker() {
        return {
            resending: this.conf.get("worker.resending") ? this.conf.get("worker.resending") : 60,
        };
    }

    get cors() {
        return { origin: this.conf.get("cors.origin") };
    }

    get auth() {
        return {
            expiresIn: this.conf.get("auth.expiresIn"),
            secretKey: this.conf.get("auth.secretKey"),
            sessionStore: this.conf.get("auth.sessionStore"),
        };
    }

    get redis() {
        return {
            prefix: process.env.REDIS_PREFIX,
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            db: process.env.REDIS_DB,
        };
    }

    get queue() {
        return {
            type: this.conf.get("queue.type"),
            prefixTrader: process.env.RABBIT_MQ_COMP_TRADER_PREFIX,
            prefixBroker: process.env.RABBIT_MQ_COMP_BROKER_PREFIX,
            workersQ: process.env.RABBIT_MQ_WORKERS,
            opt: {
                broker: {
                    host: process.env.BROKER_RABBIT_MQ_HOST ? process.env.BROKER_RABBIT_MQ_HOST : process.env.RABBIT_MQ_HOST,
                    port: Number(process.env.BROKER_RABBIT_MQ_PORT ? process.env.BROKER_RABBIT_MQ_PORT : process.env.RABBIT_MQ_PORT),
                    exchange: process.env.BROKER_RABBIT_MQ_EXCHANGE ? process.env.BROKER_RABBIT_MQ_EXCHANGE :
                        process.env.RABBIT_MQ_EXCHANGE,
                    qTrader: process.env.RABBIT_TRADER_MQ_QUEUE,
                    qBroker: process.env.RABBIT_BROKER_MQ_QUEUE,
                    user: process.env.BROKER_RABBIT_MQ_USER ? process.env.BROKER_RABBIT_MQ_USER : process.env.RABBIT_MQ_USER,
                    password: process.env.BROKER_RABBIT_MQ_PASSWORD ? process.env.BROKER_RABBIT_MQ_PASSWORD
                        : process.env.RABBIT_MQ_PASSWORD,
                    heartbeat: process.env.RABBIT_MQ_HEARTBEAT ? process.env.RABBIT_MQ_HEARTBEAT : 10,
                },
                trader: {
                    host: process.env.RABBIT_MQ_HOST,
                    port: Number(process.env.RABBIT_MQ_PORT),
                    exchange: process.env.RABBIT_MQ_EXCHANGE,
                    qTrader: process.env.RABBIT_TRADER_MQ_QUEUE,
                    qBroker: process.env.RABBIT_BROKER_MQ_QUEUE,
                    user: process.env.RABBIT_MQ_USER,
                    password: process.env.RABBIT_MQ_PASSWORD,
                    heartbeat: process.env.RABBIT_MQ_HEARTBEAT ? process.env.RABBIT_MQ_HEARTBEAT : 10,
                },
                nats: {
                    host: process.env.NATS_HOST,
                    port: Number(process.env.NATS_PORT),
                    exchange: null,
                    qTrader: null,
                    qBroker: null,
                    user: process.env.NATS_USER,
                    password: process.env.NATS_PASSWORD,
                    heartbeat: 10,
                    tls: {
                        isEnabled: (): boolean => {
                            if (
                                process.env.TLS_REJECT_UNAUTHORIZED ||
                                process.env.TLS_CA ||
                                process.env.TLS_KEY ||
                                process.env.TLS_CERT) {
                                return true;
                            }
                            return false;
                        },
                        rejectUnauthorized: process.env.TLS_REJECT_UNAUTHORIZED === "false" ? false : true,
                        ca: (): Buffer[] | undefined => {
                            if (process.env.TLS_CA) {
                                const splited = process.env.TLS_CA.split(" ");
                                const result: Buffer[] = [];
                                for (const cert of splited) {
                                    result.push(fs.readFileSync(cert));
                                }
                                return result;
                            }
                        },
                        key: (): string | undefined => {
                            if (process.env.TLS_KEY) {
                                return process.env.TLS_KEY;
                            }
                        },
                        cert: () => {
                            if (process.env.TLS_CERT) {
                                return process.env.TLS_CERT;
                            }
                        },
                    },
                    dataQueue: () => {
                        if (process.env.NATS_QUEUE_DYNAMIC_ID && process.env.NATS_QUEUE_DYNAMIC_ID === "true") {
                            const splitedHostname = process.env.HOSTNAME.split("-");
                            const queuePostfix = splitedHostname[splitedHostname.length - 1];
                            return `${process.env.NATS_QUEUE_DATA}${queuePostfix}`;
                        }
                        return process.env.NATS_QUEUE_DATA;
                    },
                    requestQueue: () => {
                        if (process.env.NATS_QUEUE_DYNAMIC_ID && process.env.NATS_QUEUE_DYNAMIC_ID === "true") {
                            const splitedHostname = process.env.HOSTNAME.split("-");
                            const queuePostfix = splitedHostname[splitedHostname.length - 1];
                            return `${process.env.NATS_QUEUE_REQUEST}${queuePostfix}`;
                        }
                        return process.env.NATS_QUEUE_REQUEST;
                    },
                    locatesId: process.env.NATS_LOCATES_ID,
                    queueDynamicId: process.env.NATS_QUEUE_DYNAMIC_ID && process.env.NATS_QUEUE_DYNAMIC_ID === "true" ? true : false,
                },
            },
        };
    }

    get mailer() {
        return {
            type: this.conf.get("mailer.type"),
            opt: {
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                secure: process.env.SMTP_SECURE,
                user: process.env.SMTP_USER,
                password: process.env.SMTP_PASSWORD,
            },
        };
    }

    get db() {
        return {
            type: process.env.DB_TYPE,
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            schema: process.env.DB_SCHEMA,
            db: process.env.DB_DATABASE,
            synch: (process.env.DB_SYNCH === "true"),
        };
    }

    get verifyService() {
        return {
            provider: this.conf.get("verifyService.provider"),
        };
    }

    get stockDataService() {
        return {
            baseUrl: this.conf.get("stockDataService.baseUrl"),
            currUrl: this.conf.get("stockDataService.currUrl"),
            apiKey: this.conf.get("stockDataService.apiKey"),
        };
    }

    get test() {
        return process.env.TEST_MQ;
    }

    static get instance(): EnvironmentService {
        return new EnvironmentService();
    }

}
