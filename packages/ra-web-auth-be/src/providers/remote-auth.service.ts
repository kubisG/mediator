import { Injectable, Inject, Logger } from "@nestjs/common";
import { HttpClient } from "../http-client.service";
import { AuthDto } from "../dto/auth.dto";
import { BearerToken } from "../interfaces/bearer-token.interface";
import { BearerData } from "../interfaces/bearer-data.interface";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { IAuthService } from "../interfaces/auth-service.interface";

@Injectable()
export class RemoteAuthService implements IAuthService {

    constructor(
        private httpClient: HttpClient,
        private env: EnvironmentService,
        @Inject("logger") private logger: Logger,
    ) { }

    async createToken(auth: AuthDto): Promise<BearerToken> {
        const url = this.env.auth.serviceUrl;
        return await this.httpClient.post<BearerToken>(url, auth);
    }

    async verifyToken(token: string): Promise<BearerData> {
        const url = `${this.env.auth.serviceUrl}/?token=${token}`;
        return await this.httpClient.get(url);
    }

    async destroySession(token: string) {
        const url = `${this.env.auth.serviceUrl}/?token=${token}`;
        return await this.httpClient.delete(url);
    }

    async validateUser(data: BearerData): Promise<any> {
        const url = `${this.env.auth.serviceUrl}/user/validate`;
        return await this.httpClient.post<any>(url, data);
    }

    async getUserData<T>(token: string): Promise<T> {
        this.logger.error("Remote auth service don't implement this method");
        return {} as T;
    }

    public createDummyToken(...args: any[]): any {
        this.logger.error("Remote auth service don't implement this method");
    }

    setVerifyService(verify) {
        this.logger.error("Remote auth service don't implement this method");
     }

    setSessionDataService(sessionData) {
        this.logger.error("Remote auth service don't implement this method");
     }
}
