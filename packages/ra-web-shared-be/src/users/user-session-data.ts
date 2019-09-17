import { SessionData } from "@ra/web-auth-be/dist/session-data/session-data.interface";
import { BearerData } from "@ra/web-auth-be/dist/interfaces/bearer-data.interface";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { RaUser } from "@ra/web-core-be/dist/db/entity/ra-user";
import { UserData } from "./user-data.interface";
import { Injectable, Inject } from "@nestjs/common";
import { ObjectRightsRepository } from "@ra/web-core-be/dist/dao/repositories/object-rights.repository";

@Injectable()
export class UserSessionData implements SessionData {

    constructor(
        private env: EnvironmentService,
        @Inject("objectRightsRepository") private raObjectRights: ObjectRightsRepository,
    ) { }

    public async getSessionData(entry: RaUser, tokenData: BearerData, accessToken: string): Promise<UserData> {
        return {
            email: tokenData.email,
            sid: tokenData.sid,
            iat: tokenData.iat,
            exp: tokenData.exp,
            userId: entry.id,
            compId: entry.company.id,
            clientId: entry.company.clientId,
            nickName: entry.username,
            role: entry.class,
        };
    }

    public async getResponseData(entry: any, tokenData: BearerData, accessToken: string): Promise<any> {
        const rights = await this.raObjectRights.find({
            userId: entry.id, companyId: entry.company.id,
        });

        return {
            expiresIn: this.env.auth.expiresIn,
            accessToken,
            payload: {
                id: entry.id,
                firstName: entry.firstName,
                lastName: entry.lastName,
                nickName: entry.username,
                clientId: entry.company.clientId,
                compId: entry.company.id,
                rights,
            },
        };
    }

    public async getDummyToken(...args: any[]) {
        return {};
    }

}
