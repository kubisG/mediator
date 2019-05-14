export interface Env {
    production: boolean;
    logging?: {
        provider: number,
    };
    wsUrl?: string;
    apiUrl: string;
    loginTimeout?: number;
    loginIdle?: number;
    version?: string;
    versionLong?: string;
    precision?: number;
    app?: any;
}
