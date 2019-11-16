import { Verify } from "../verify/verify.interface";
import { SessionDataService } from "../session-data/session-data.service";
import { BearerToken } from "../interfaces/bearer-token.interface";
import { AuthDto } from "src/dto/auth.dto";
import { BearerData } from "../interfaces/bearer-data.interface";

export interface IAuthService {

    setVerifyService(verify: Verify): void;

    setSessionDataService(sessionData: SessionDataService);

    getUserData<T>(token: string): Promise<T>;

    createDummyToken(...args: any[]): any;

    verifyToken(token: string): BearerData;

    createToken(auth: AuthDto): Promise<BearerToken>;

    validateUser(data: BearerData): Promise<any>;

    destroySession(token: string): Promise<void>;
}