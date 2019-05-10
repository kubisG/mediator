import { SessionData } from "./session-data.interface";
import { RaUser } from "@ra/web-core-be/db/entity/ra-user";
import { BearerData } from "../interfaces/bearer-data.interface";
import { EnvironmentService } from "@ra/web-env-be/environment.service";
import { PreferencesService } from "@ra/web-core-be/preferences.service";

export class RaUserSessionData implements SessionData {

    constructor(
        private env: EnvironmentService,
        private preferencesService: PreferencesService,
    ) { }

    public async getSessionData(entry: RaUser, tokenData: BearerData, accessToken: string): Promise<any> {

        const appPrefs = await this.preferencesService.findCompanyPrefs(entry.company.id);

        return {
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
        }
    }

    public async getResponseData(entry: RaUser, tokenData: BearerData, accessToken: string): Promise<any> {

        const prefs = await this.preferencesService.findPrefs(entry.id);
        const appPrefs = await this.preferencesService.findCompanyPrefs(entry.company.id);

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

    public async getDummyToken(companyId, userId, app): Promise<any> {
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
