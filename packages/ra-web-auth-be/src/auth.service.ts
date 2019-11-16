import { Inject, Injectable } from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { BearerData } from "./interfaces/bearer-data.interface";
import { BearerToken } from "./interfaces/bearer-token.interface";
import { SessionDataService } from "./session-data/session-data.service";
import { IAuthService } from "./providers/auth-service.interface";
import { Verify } from "./verify/verify.interface";

@Injectable()
export class AuthService {

    constructor(@Inject("authService") private authService: IAuthService) { }

    setVerifyService(verify: Verify): void {
        this.authService.setVerifyService(verify);
    }

    setSessionDataService(sessionData: SessionDataService): void {
        this.authService.setSessionDataService(sessionData);
    }

    async createToken(auth: AuthDto): Promise<BearerToken> {
        return await this.authService.createToken(auth);
    }

    async validateUser(data: BearerData): Promise<any> {
        return this.authService.validateUser(data);
    }

    async destroySession(token: string): Promise<void> {
        await this.authService.destroySession(token);
    }

    verifyToken(token: string): BearerData {
        return this.authService.verifyToken(token);
    }

    async getUserData<T>(token: string): Promise<T> {
        return this.authService.getUserData(token);
    }

    public createDummyToken(...args: any[]): any {
        return this.authService.createDummyToken(...args);
    }
}
