import { Injectable, NotImplementedException } from "@nestjs/common";
import { BearerToken } from "src/interfaces/bearer-token.interface";
import { AuthDto } from "src/dto/auth.dto";
import { BearerData } from "src/interfaces/bearer-data.interface";
import { IAuthService } from "./auth-service.interface";

const DUMMY_TOKEN = {
    expiresIn: 1, accessToken: "accessToken", firstName: "firstName", lastName: "lastName", companyName: "companyName",
    nickName: "nickName", compId: 1, userId: 1, compQueue: "compQueue", compQueueTrader: "compQueueTrader", compQueueBroker: "compQueueBroker",
    app: 1, appPrefs: {}, ClientID: "ClientID",
} as BearerToken;
const DUMMY_SID = "dummysid";
const DUMMY_DATA = { email: "dummy@test.com", sid: DUMMY_SID } as BearerData;

@Injectable()
export class DummyAuthService implements IAuthService {

    async createToken(auth: AuthDto): Promise<BearerToken> {
        return DUMMY_TOKEN;
    }

    verifyToken(token: string): BearerData {
        return DUMMY_DATA;
    }

    async validateUser(data: BearerData): Promise<BearerToken> {
        return DUMMY_TOKEN;
    }

    async destroySession(token: string) {
        throw new NotImplementedException("Dummy auth service don't implement this method");
    }

    async getUserData<T>(token: string): Promise<T> {
        throw new NotImplementedException("Dummy auth service don't implement this method");
    }

    createDummyToken(...args: any[]): any {
        throw new NotImplementedException("Dummy auth service don't implement this method");
    }

    setVerifyService(verify) {
        throw new NotImplementedException("Dummy auth service don't implement this method");
    }

    setSessionDataService(sessionData) {
        throw new NotImplementedException("Dummy auth service don't implement this method");
    }
}
