import { Verify } from "../verify/verify.interface";
import { SessionDataService } from "../session-data/session-data.service";
import { BearerToken } from "./bearer-token.interface";
import { AuthDto } from "src/dto/auth.dto";
import { BearerData } from "./bearer-data.interface";

export interface IAuthService {

    setVerifyService(verify: Verify): void;

    setSessionDataService(sessionData: SessionDataService);

    getUserData<T>(token: string): Promise<T>;

    createDummyToken(...args: any[]): any;

    verifyToken(token: string): BearerData | Promise<BearerData>;

    createToken(auth: AuthDto): Promise<BearerToken>;

    validateUser(data: BearerData): Promise<any>;

    destroySession(token: string): Promise<void>;
}