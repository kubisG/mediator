import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { AuthDto } from "./dto/auth.dto";
import { BearerData } from "./interfaces/bearer-data.interface";
import { BearerToken } from "./interfaces/bearer-token.interface";
import { SessionStore } from "@ra/web-core-be/sessions/providers/session-store.interface";
import * as uuid from "uuid/v4";
import { Logger } from "@ra/web-core-be/logger/providers/logger";
import { VerifyProviderService } from "./verify-provider.service";
import { SessionDataProviderService } from "./session-data-provider.service";
import { SessionData } from "./session-data/session-data.interface";

@Injectable()
export class AuthService {

    private sessionDataService: SessionData;

    constructor(
        private readonly jwtService: JwtService,
        @Inject("sessions") private sessions: SessionStore,
        private verifyService: VerifyProviderService,
        @Inject("logger") private logger: Logger,
        private sessionDataProviderService: SessionDataProviderService,
    ) {

    }

    async createToken(auth: AuthDto): Promise<BearerToken> {
        this.sessionDataService = this.sessionDataProviderService.sessionDataService;
        const entry: any = await this.verifyService.find(auth);
        if (entry === null) {
            return null;
        }
        const sid = uuid.default ? uuid.default() : uuid();
        const accessToken: string = this.jwtService.sign({ email: auth.email, sid });
        const tokenData: BearerData = this.jwtService.verify<BearerData>(accessToken);

        const sessionData = await this.sessionDataService.getSessionData(entry, tokenData, accessToken);
        const responseData = await this.sessionDataService.getResponseData(entry, tokenData, accessToken);

        this.sessions.set(sid, sessionData);
        return responseData;
    }


    async validateUser(data: BearerData): Promise<any> {
        return await this.sessions.get(data.sid);
    }

    async destroySession(token: string) {
        try {
            const data: BearerData = this.jwtService.verify<BearerData>(token);
            this.sessions.destroy(data.sid);
        } catch (ex) {
            this.logger.error(ex.message);
        }
    }

    verifyToken(token: string): BearerData {
        return this.jwtService.verify<BearerData>(token);
    }

    async getUserData(token: string): Promise<any> {
        const encodedToken = this.verifyToken(token);
        return await this.sessions.get(encodedToken.sid);
    }

    public createDummyToken(...args: any[]): any {
        return this.sessionDataService.getDummyToken(args);
    }
}
