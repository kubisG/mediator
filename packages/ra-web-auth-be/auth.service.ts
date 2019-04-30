import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { AuthDto } from "./dto/auth.dto";
import { BearerData } from "./interfaces/bearer-data.interface";
import { BearerToken } from "./interfaces/bearer-token.interface";
import { SessionStore } from "@ra/web-core-be/sessions/providers/session-store.interface";
import { EnvironmentService } from "@ra/web-env-be/environment.service";
import { Verify } from "./verify/verify.interface";
import * as uuid from "uuid/v4";
import { Logger } from "@ra/web-core-be/logger/providers/logger";
import { PreferencesService } from "@ra/web-core-be/preferences.service";
import { RaUser } from "@ra/web-core-be/db/entity/ra-user";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @Inject("sessions") private sessions: SessionStore,
        @Inject("verifyService") private verifyService: Verify,
        private preferencesService: PreferencesService,
        @Inject("logger") private logger: Logger,
        private env: EnvironmentService,
    ) { }

    async createToken(auth: AuthDto): Promise<BearerToken> {
        const entry: RaUser = await this.verifyService.find(auth);
        if (entry === null) {
            return null;
        }
        const sid = uuid.default ? uuid.default() : uuid();
        const accessToken = this.jwtService.sign({ email: auth.email, sid });
        const tokenData: BearerData = this.jwtService.verify<BearerData>(accessToken);

        const prefs = await this.preferencesService.findPrefs(entry.id);
        const appPrefs = await this.preferencesService.findCompanyPrefs(entry.company.id);

        this.sessions.set(sid, {
            email: tokenData.email,
            sid: tokenData.sid,
            iat: tokenData.iat,
            exp: tokenData.exp,
            compQueue: `${this.env.queue.prefixTrader}${entry.company.id}`,
            compQueueTrader: `${this.env.queue.prefixTrader}${entry.company.id}`,
            compQueueBroker: `${this.env.queue.prefixBroker}${entry.company.id}`,
            compId: entry.company.id,
            userId: entry.id,
            role: entry.class,
            companyName: entry.company.companyName,
            nickName: entry.username,
            app: entry.app,
            appPrefs: appPrefs,
            ClientID: entry.company.ClientID,
        });
        return {
            expiresIn: this.env.auth.expiresIn,
            accessToken,
            role: entry.class,
            rows: prefs ? prefs.rows : 5,
            theme: prefs ? prefs.theme : "none",
            id: entry.id,
            firstName: entry.firstName,
            lastName: entry.lastName,
            companyName: entry.company.companyName,
            nickName: entry.username,
            compId: entry.company.id,
            compQueue: `${this.env.queue.prefixTrader}${entry.company.id}`,
            compQueueTrader: `${this.env.queue.prefixTrader}${entry.company.id}`,
            compQueueBroker: `${this.env.queue.prefixBroker}${entry.company.id}`,
            app: entry.app,
            appPrefs: appPrefs,
            ClientID: entry.company.ClientID,
        };
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

    public createDummyToken(companyId, userId, app): any {
        return {
            email: null,
            sid: null,
            iat: null,
            exp: null,
            compQueue: `${this.env.queue.prefixTrader}${companyId}`,
            compQueueTrader: `${this.env.queue.prefixTrader}${companyId}`,
            compQueueBroker: `${this.env.queue.prefixBroker}${companyId}`,
            compId: Number(companyId),
            userId: null,
            role: null,
            companyName: null,
            nickName: null,
            app: app,
            appPrefs: null,
        };
    }
}
