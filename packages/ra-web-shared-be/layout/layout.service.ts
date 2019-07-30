import { Injectable, Inject } from "@nestjs/common";
import { AuthService } from "@ra/web-auth-be/auth.service";
import { PreferenceRepository } from "@ra/web-core-be/dao/repositories/preference.repository";
import { UserData } from "../users/user-data.interface";

@Injectable()
export class LayoutService {

    constructor(
        private readonly authService: AuthService,
        @Inject("preferenceRepository") private raPreferences: PreferenceRepository,
    ) { }

    async getLayoutConfig(token: string, name: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.raPreferences.getLayoutConfig(userData.userId, userData.compId, name);
    }

    async setLayoutConfig(token: string, config: any, name: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.raPreferences.setLayoutConfig(userData.userId, userData.compId, config, name);
    }

    async deleteLayoutConfig(token: string, name: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.raPreferences.deleteLayoutConfig(userData.userId, userData.compId, name);
    }

    async getLayoutsName(token: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.raPreferences.getLayoutsName(userData.userId, userData.compId);
    }

    async getLayoutDefault(token: string, modul: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.raPreferences.findOne({
            userId: userData.userId,
            companyId: userData.compId,
            name: `default_layout_${modul}`
        });
    }

    async setLayoutDefault(token: string, modul: string, name: any) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.raPreferences.save({
            name: `default_layout_${modul}`,
            value: name,
            userId: userData.userId,
            companyId: userData.compId,
        });
    }

}
