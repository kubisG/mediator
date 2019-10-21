import { AuthDto } from "@ra/web-auth-be/dist/dto/auth.dto";
import { BearerToken } from "@ra/web-auth-be/dist/interfaces/bearer-token.interface";
import { BearerData } from "@ra/web-auth-be/dist/interfaces/bearer-data.interface";

export class AuthMockService {

    setVerifyService(verify) {

    }

    setSessionDataService(sessionData) {

    }

    async createToken(auth: AuthDto): Promise<BearerToken> {
        return {
            expiresIn: 1,
            accessToken: "accessToken",
            firstName: "firstName",
            lastName: "lastName",
            companyName: "companyName",
            nickName: "nickName",
            compId: 1,
            userId: 1,
            compQueue: "compQueue",
            compQueueTrader: "compQueueTrader",
            compQueueBroker: "compQueueBroker",
            app: 1,
            appPrefs: {},
            ClientID: "ClientID"
        };
    }


    async validateUser(data: BearerData): Promise<any> {
        return {};
    }

    async destroySession(token: string) {

    }

    verifyToken(token: string): BearerData {
        return {
            email: "test@rapidaddition.com",
            sid: "sid"
        };
    }

    async getUserData<T>(token: string): Promise<T> {
        return {
            expiresIn: 1,
            accessToken: "accessToken",
            firstName: "firstName",
            lastName: "lastName",
            companyName: "companyName",
            nickName: "nickName",
            compId: 1,
            userId: 1,
            compQueue: "compQueue",
            compQueueTrader: "compQueueTrader",
            compQueueBroker: "compQueueBroker",
            app: 1,
            appPrefs: {},
            ClientID: "ClientID"
        } as unknown as T;
    }

    public createDummyToken(...args: any[]): any {

    }

}
