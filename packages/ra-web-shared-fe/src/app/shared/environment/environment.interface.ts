import { InjectionToken } from "@angular/core";

export const ENVIRONMENT = new InjectionToken<any>("environmentInterface");

export interface EnvironmentInterface {
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
