import { Inject, Injectable } from "@nestjs/common";

import { DbException } from "@ra/web-core-be/dist/exceptions/db.exception";
import { UserData } from "../users/user-data.interface";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { PreferenceRepository } from "@ra/web-core-be/dist/dao/repositories/preference.repository";
import { UserRepository } from "@ra/web-core-be/dist/dao/repositories/user.repository";
import { RaPreference } from "@ra/web-core-be/dist/db/entity/ra-preference";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";

@Injectable()
export class PreferencesService {

    constructor(
        @Inject("preferenceRepository") private raPreference: PreferenceRepository,
        @Inject("userRepository") private raUser: UserRepository,
        private authService: AuthService,
        private env: EnvironmentService,
    ) { }

    async getAppPref(name: string) {
        const pref = await this.raPreference.findOne({
            name, userId: 0, companyId: 0,
            version: this.env.appVersion ? this.env.appVersion : "1.0.0"
        });
        if (pref) {
            return JSON.parse(pref.value);
        } else {
            return;
        }
    }

    async find(token: string): Promise<any> {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        const pref = await this.findPrefs(userData.userId);
        const user = await this.raUser.findOne({ id: userData.userId });
        const data = {};
        data["user"] = user;
        data["pref"] = pref ? JSON.parse(pref.value) : {};
        return data;
    }

    async findAll() {
        return await this.raPreference.find();
    }

    async findPrefs(userId) {
        let userPref = await this.raPreference.createQueryBuilder("pref")
            .where("pref.userId=:user and pref.name='layout.prefs' and pref.version=:version"
                , { user: userId, version: this.env.appVersion ? this.env.appVersion : "1.0.0" })
            .getOne();
        // we dont have preferences for user, so we try to find default prefs
        if ((!userPref) || (userPref === null)) {
            userPref = await this.raPreference.createQueryBuilder("pref")
                .where("pref.userId=:user and pref.name='layout.prefs' and pref.version=:version"
                    , { user: 0, version: this.env.appVersion ? this.env.appVersion : "1.0.0" })
                .getOne();
        }
        return userPref;
    }

    async save(prefs: any, token: string): Promise<any> {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        try {
            if (prefs.pref) {
                const newPref = new RaPreference();
                newPref.name = "layout.prefs";
                newPref.userId = userData.userId;
                newPref.companyId = userData.compId;
                newPref.version = this.env.appVersion;
                newPref.value = JSON.stringify(prefs.pref);
                return await this.raPreference.save(newPref);
            }
        } catch (ex) {
            throw new DbException(ex, "RaPreference");
        }
    }

    async update(pref: any, token: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        try {
            let storedPref = await this.raPreference.findOne({
                userId: userData.userId, companyId: userData.compId, name: "layout.prefs"
                , version: this.env.appVersion ? this.env.appVersion : "1.0.0",
            });
            if (!storedPref) {
                storedPref = new RaPreference();
                storedPref.userId = userData.userId;
                storedPref.companyId = userData.compId;
                storedPref.version = this.env.appVersion;
                storedPref.name = "layout.prefs";
                storedPref.value = "{}";
            }
            const prefObject = JSON.parse(storedPref.value);
            prefObject[pref.name] = pref.value;
            storedPref.value = JSON.stringify(prefObject);
            return await this.raPreference.save(storedPref);
        } catch (ex) {
            console.log(ex);
            throw new DbException(ex, "RaUser");
        }
    }

    async findPref(userId, compId, key): Promise<any> {
        let pref = await this.raPreference.createQueryBuilder("pref")
            .where("pref.userId=:user and pref.name=:name and pref.companyId=:comp and pref.version=:version"
                , { user: userId, comp: compId, name: key, version: this.env.appVersion ? this.env.appVersion : "1.0.0" })
            .getOne();
        // we dont have preferences for user, so we try to find default prefs
        if ((!pref) || (pref === null)) {
            pref = await this.raPreference.createQueryBuilder("pref")
                .where("pref.userId=:user and pref.name=:name and pref.companyId=:comp and pref.version=:version"
                    , { user: 0, comp: 0, name: key, version: this.env.appVersion ? this.env.appVersion : "1.0.0" })
                .getOne();
        }

        if (pref) {
            return pref.value;
        } else {
            return null;
        }
    }

    async savePref(userId, compId, key, value): Promise<any> {
        const newPref = new RaPreference();
        newPref.name = key;
        newPref.userId = userId;
        newPref.companyId = compId;
        newPref.value = value;
        newPref.version = this.env.appVersion;
        return await this.raPreference.save(newPref);
    }

    async loadUserPref(token: string, key: string): Promise<any> {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.findPref(userData.userId, userData.compId, key);
    }

    async saveUserPref(token: string, key: string, value: any): Promise<[RaPreference[]]> {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.savePref(userData.userId, userData.compId, key, value);
    }

    public async createPreference(pref: any) {
        pref.version = this.env.appVersion;
        return await this.raPreference.save(pref);
    }

    public async savePreference(pref: any) {
        if (pref.userId === undefined && pref.companyId === undefined) {
            return await this.createPreference({
                name: pref.name,
                value: pref.value,
                userId: pref.newUserId,
                companyId: pref.newCompanyId,
                version: this.env.appVersion,
            });
        }
        return await this.raPreference.update(
            {
                name: pref.name,
                userId: pref.userId,
                companyId: pref.companyId,
                version: this.env.appVersion ? this.env.appVersion : "1.0.0",
            },
            {
                value: pref.value,
                userId: pref.newUserId,
                companyId: pref.newCompanyId,
                version: this.env.appVersion,
            },
        );
    }

    public async deletePreference(name: any, user: number, company: number) {
        return await this.raPreference.delete({ name, userId: user, companyId: company, version: this.env.appVersion });
    }

}
