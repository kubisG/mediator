import { Inject, Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SessionStore } from "@ra/web-core-be/dist/sessions/providers/session-store.interface";
import { VerifyService } from "src/verify/verify.service";
import { SessionDataService } from "src/session-data/session-data.service";
import { IAuthService } from "../interfaces/auth-service.interface";
import { BearerData } from "src/interfaces/bearer-data.interface";
import { AuthDto } from "src/dto/auth.dto";
import { BearerToken } from "src/interfaces/bearer-token.interface";
import { Verify } from "src/verify/verify.interface";

import * as uuid from "uuid/v4";

@Injectable()
export class JwtAuthService implements IAuthService {

    constructor(
        private readonly jwtService: JwtService,
        private verifyService: VerifyService,
        private sessionDataService: SessionDataService,
        @Inject("sessions") private sessions: SessionStore,
        @Inject("logger") private logger: Logger,
    ) { }

    async createToken(auth: AuthDto): Promise<BearerToken> {
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

    setVerifyService(verify: Verify): void {
        this.verifyService = verify;
    }

    setSessionDataService(sessionData: SessionDataService): void {
        this.sessionDataService = sessionData;
    }

    async getUserData<T>(token: string): Promise<T> {
        const encodedToken = this.verifyToken(token);
        return await this.sessions.get(encodedToken.sid);
    }

    public createDummyToken(...args: any[]): any {
        return this.sessionDataService.getDummyToken(...args);
    }
}
