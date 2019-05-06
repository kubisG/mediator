export interface Logger {

    error(msg: any): void;

    warn(msg: any): void;

    info(msg: any): void;

    verbose(msg: any): void;

    debug(msg: any): void;

    silly(msg: any): void;

    enableLogging(enabled: boolean): void;

}
