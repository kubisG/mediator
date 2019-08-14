import { BearerData } from "../interfaces/bearer-data.interface";

export interface SessionData {

    getSessionData(entry: any, tokenData: BearerData, accessToken: string): Promise<any>;

    getResponseData(entry: any, tokenData: BearerData, accessToken: string): Promise<any>;

    getDummyToken(...args: any[]): any;

}
