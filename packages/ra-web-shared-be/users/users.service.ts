import { Injectable, UnauthorizedException, Inject } from "@nestjs/common";
import { AuthService } from "@ra/web-auth-be/auth.service";
import { AuthDto } from "@ra/web-auth-be/dto/auth.dto";
import { UserData } from "./user-data.interface";
import { PreferenceRepository } from "@ra/web-core-be/dao/repositories/preference.repository";

@Injectable()
export class UsersService {

    constructor(
        private authService: AuthService,
        @Inject("preferenceRepository") private preferenceRepository: PreferenceRepository,
    ) { }

    async logIn(auth: AuthDto): Promise<any> {
        const bearerToken = await this.authService.createToken(auth);
        if (bearerToken === null) {
            throw new UnauthorizedException();
        }
        return bearerToken;
    }

    async logOut(token: string): Promise<any> {
        return await this.authService.destroySession(token);
    }

    async getLayoutConfig(token: string, name: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.preferenceRepository.getLayoutConfig(userData.userId, userData.compId, name);
    }

    async setLayoutConfig(token: string, config: any, name: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.preferenceRepository.setLayoutConfig(userData.userId, userData.compId, config, name);
    }

    async deleteLayoutConfig(token: string, name: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.preferenceRepository.deleteLayoutConfig(userData.userId, userData.compId, name);
    }

    async getLayoutsName(token: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.preferenceRepository.getLayoutsName(userData.userId, userData.compId);
    }

}
