import { Injectable, Inject } from "@nestjs/common";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { PreferenceRepository } from "@ra/web-core-be/dist/dao/repositories/preference.repository";
import { UserData } from "../users/user-data.interface";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";

@Injectable()
export class LayoutService {

    constructor(
        private readonly authService: AuthService,
        @Inject("preferenceRepository") private raPreferences: PreferenceRepository,
        private env: EnvironmentService,
    ) { }

    getVersion() {
        return this.env.appVersion ? this.env.appVersion : "1.0.0";
    }

    async getLayoutConfig(token: string, name: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.raPreferences.getLayoutConfig(userData.userId, userData.compId, name, this.getVersion());
    }

    async setLayoutConfig(token: string, config: any, name: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.raPreferences.setLayoutConfig(userData.userId, userData.compId, config, name, this.getVersion());
    }

    async deleteLayoutConfig(token: string, name: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.raPreferences.deleteLayoutConfig(userData.userId, userData.compId, name, this.getVersion());
    }

    async getLayoutsName(token: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.raPreferences.getLayoutsName(userData.userId, userData.compId, this.getVersion());
    }

    async getLayoutDefault(token: string, modul: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.raPreferences.findOne({
            userId: userData.userId,
            companyId: userData.compId,
            name: `default_layout_${modul}`,
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

    async setLayoutPublicPrivate(token: string, state: string, name: any) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);

        return await this.raPreferences.setPublicPrivate(userData.userId, userData.compId, state, `layout_${name}`, this.getVersion());
    }

}
