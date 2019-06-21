import { Injectable } from "@nestjs/common";
import { SessionData } from "./session-data.interface";
import { BearerData } from "../interfaces/bearer-data.interface";

@Injectable()
export class SessionDataService implements SessionData {

    async getSessionData(entry: any, tokenData: BearerData, accessToken: string): Promise<any> {
        return { ...entry, bla: 333 };
    }

    async getResponseData(entry: any, tokenData: BearerData, accessToken: string): Promise<any> {
        return { ...entry, bla: 444 };
    }

    async getDummyToken(...args: any[]) {
        return { bla: 555 };
    }


}
