import { Injectable, Inject, Logger, NotImplementedException } from "@nestjs/common";
import { HttpClient } from "src/http-client.service";
import { AuthDto } from "src/dto/auth.dto";
import { BearerToken } from "src/interfaces/bearer-token.interface";
import { BearerData } from "src/interfaces/bearer-data.interface";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";

const fake_base_url = "http://localhost:3002/auth";

@Injectable()
export class RemoteAuthService {

    constructor(
        private httpClient: HttpClient,
        private environmentService: EnvironmentService,
        @Inject("logger") private logger: Logger,
    ) { }

    async createToken(auth: AuthDto): Promise<BearerToken> {
        const url = fake_base_url;
        return await this.httpClient.post<BearerToken>(url, auth);
    }

    async verifyToken(token: string): Promise<BearerData> {
        const url = `${fake_base_url}/?token=${token}`;
        return await this.httpClient.get(url);
    }

    async destroySession(token: string) {
        const url = `${fake_base_url}/?token=${token}`;
        return await this.httpClient.delete(url);
    }

    async validateUser(data: BearerData): Promise<any> {
        const url = `${fake_base_url}/user/validate`;
        return await this.httpClient.post<any>(url, data);
    }

    async getUserData<T>(token: string): Promise<T> {
        throw new NotImplementedException("Remote auth service don't implement this method");
    }

    public createDummyToken(...args: any[]): any {
        throw new NotImplementedException("Remote auth service don't implement this method");
    }

    setVerifyService(verify) {
        throw new NotImplementedException("Remote auth service don't implement this method");
     }

    setSessionDataService(sessionData) {
        throw new NotImplementedException("Remote auth service don't implement this method");
     }
}
