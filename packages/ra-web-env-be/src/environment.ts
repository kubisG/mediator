import * as config from "config";

export const environment = {
    production: config.get("production"),
    logging: {
        provider: config.get("logging.provider"),
        remote: config.get("logging.remote"),
        db: config.get("logging.db"),
    },
    appPort: config.get("app.port"),
    appVersion: config.get("app.version"),
    appUrl: {
        url: () => {
            return process.env.FE_URL;
        },
    },
    cors: {
        origin: config.get("cors.origin"),
    },
    auth: {
        expiresIn: config.get("auth.expiresIn"),
        secretKey: config.get("auth.secretKey"),
        sessionStore: config.get("auth.sessionStore"),
    },
    redis: {
        prefix: () => {
            return process.env.REDIS_PREFIX;
        },
        host: () => {
            return process.env.REDIS_HOST;
        },
        port: () => {
            return process.env.REDIS_PORT;
        },
        db: () => {
            return process.env.REDIS_DB;
        },
    },
    queue: {
        type: config.get("queue.type"),
        opt: {
            host: () => {
                return process.env.RABBIT_MQ_HOST;
            },
            port: (): number => {
                return Number(process.env.RABBIT_MQ_PORT);
            },
            exchange: () => {
                return process.env.RABBIT_MQ_EXCHANGE;
            },
            qTrader: () => {
                return process.env.RABBIT_TRADER_MQ_QUEUE;
            },
            qBroker: () => {
                return process.env.RABBIT_BROKER_MQ_QUEUE;
            },
            user: () => {
                return process.env.RABBIT_MQ_USER;
            },
            password: () => {
                return process.env.RABBIT_MQ_PASSWORD;
            },
        },
    },
    db: {
        type: (): string => {
            return process.env.DB_TYPE;
        },
        host: () => {
            return process.env.DB_HOST;
        },
        port: (): number => {
            return Number(process.env.DB_PORT);
        },
        user: () => {
            return process.env.DB_USER;
        },
        password: () => {
            return process.env.DB_PASSWORD;
        },
        schema: () => {
            return process.env.DB_SCHEMA;
        },
        db: () => {
            return process.env.DB_DATABASE;
        },
        synch: () => {
            return process.env.DB_SYNCH;
        },
    },
    mailer: {
        type: config.get("mailer.type"),
        opt: {
            host: () => {
                return process.env.SMTP_HOST;
            },
            port: (): number => {
                return Number(process.env.SMTP_PORT);
            },
            secure: () => {
                return process.env.SMTP_SECURE;
            },
            user: () => {
                return process.env.SMTP_USER;
            },
            password: () => {
                return process.env.SMTP_PASSWORD;
            },
        },
    },
};
