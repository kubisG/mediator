import { SessionData } from "@ra/web-auth-be/session-data/session-data.interface";
import { BearerData } from "@ra/web-auth-be/interfaces/bearer-data.interface";
import { EnvironmentService } from "@ra/web-env-be/environment.service";
import { RaUser } from "@ra/web-core-be/src/db/entity/ra-user";
import { UserData } from "./user-data.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserSessionData implements SessionData {

    constructor(
        private env: EnvironmentService,
    ) { }

    public async getSessionData(entry: RaUser, tokenData: BearerData, accessToken: string): Promise<UserData> {
        return {
            email: tokenData.email,
            sid: tokenData.sid,
            iat: tokenData.iat,
            exp: tokenData.exp,
            userId: entry.id,
            compId: entry.company.id,
            nickName: entry.username,
            role: entry.class
        }
    }

    public async getResponseData(entry: any, tokenData: BearerData, accessToken: string): Promise<any> {
        return {
            expiresIn: this.env.auth.expiresIn,
            accessToken,
            payload: {
                id: entry.id,
                firstName: entry.firstName,
                lastName: entry.lastName,
                nickName: entry.username,
                compId: entry.company.id,
            }
        };
    }

    public async getDummyToken(...args: any[]) {
        return {};
    }

}
