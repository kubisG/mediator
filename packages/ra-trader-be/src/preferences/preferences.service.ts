import { Inject, Injectable } from "@nestjs/common";

import { PreferenceDto } from "./dto/preferences.dto";
import { DbException } from "@ra/web-core-be/dist/exceptions/db.exception";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { MessageValidatorService } from "@ra/web-core-be/dist/validators/message-validator.service";
import { PreferenceRepository } from "../dao/repositories/preference.repository";
import { UserRepository } from "../dao/repositories/user.repository";
import { RaPreference } from "../entity/ra-preference";
import { UserData } from "../users/user-data.interface";

@Injectable()
export class PreferencesService {

    constructor(
        @Inject("preferenceRepository") private raPreference: PreferenceRepository,
        @Inject("userRepository") private raUser: UserRepository,
        @Inject("messageFilter") private messageValidatorService: MessageValidatorService,
        private authService: AuthService,
    ) { }

    async getAppPref(name: string) {
        const pref = await this.raPreference.findOne({ name, userId: 0, companyId: 0 });
        if (pref) {
            return JSON.parse(pref.value);
        } else {
            return;
        }
    }

    async find(token: string): Promise<any> {
        const userData = await this.authService.getUserData<UserData>(token);
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
            .where("pref.userId=:user and pref.name='layout.prefs'"
                , { user: userId })
            .getOne();
        // we dont have preferences for user, so we try to find default prefs
        if ((!userPref) || (userPref === null)) {
            userPref = await this.raPreference.createQueryBuilder("pref")
                .where("pref.userId=:user and pref.name='layout.prefs'"
                    , { user: 0 })
                .getOne();
        }
        return userPref;
    }

    async save(prefs: PreferenceDto, token: string): Promise<any> {
        const userData = await this.authService.getUserData<UserData>(token);
        try {
            if (prefs.pref) {
                const newPref = new RaPreference();
                newPref.name = "layout.prefs";
                newPref.userId = userData.userId;
                newPref.companyId = userData.compId;
                newPref.value = JSON.stringify(prefs.pref);
                await this.raPreference.save(newPref);
            }
        } catch (ex) {
            throw new DbException(ex, "RaPreference");
        }
    }

    async update(pref: any, token: string) {
        const userData = await this.authService.getUserData<UserData>(token);
        try {
            let storedPref = await this.raPreference.findOne({
                userId: userData.userId, companyId: userData.compId, name: "layout.prefs"
            });
            if (!storedPref) {
                storedPref = new RaPreference();
                storedPref.userId = userData.userId;
                storedPref.companyId = userData.compId;
                storedPref.name = "layout.prefs";
                storedPref.value = "{}";
            }
            const prefObject = JSON.parse(storedPref.value);
            prefObject[pref.name] = pref.value;
            storedPref.value = JSON.stringify(prefObject);
            return await this.raPreference.save(storedPref);
        } catch (ex) {
            throw new DbException(ex, "RaUser");
        }
    }

    async findPref(userId, compId, key): Promise<any> {
        let pref = await this.raPreference.createQueryBuilder("pref")
            .where("pref.userId=:user and pref.name=:name and pref.companyId=:comp"
                , { user: userId, comp: compId, name: key })
            .getOne();
        // we dont have preferences for user, so we try to find default prefs
        if ((!pref) || (pref === null)) {
            pref = await this.raPreference.createQueryBuilder("pref")
            .where("pref.userId=:user and pref.name=:name and pref.companyId=:comp"
                    , { user: 0, comp: 0, name: key })
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
        return await this.raPreference.save(newPref);
    }

    async loadUserPref(token: string, key: string): Promise<any> {
        let userData;
        if (token) {
            userData = await this.authService.getUserData<UserData>(token);
        }
        return await this.findPref(userData ? userData.userId : 0, userData ? userData.compId : 0, key);
    }

    async saveUserPref(token: string, key: string, value: any): Promise<[RaPreference[]]> {
        const userData = await this.authService.getUserData<UserData>(token);
        return await this.savePref(userData.userId, userData.compId, key, value);
    }

    public async createPreference(pref: any) {
        return await this.raPreference.insert(pref);
    }

    public async savePreference(pref: any) {
        if (pref.userId === undefined && pref.companyId === undefined) {
            return await this.createPreference({
                name: pref.name,
                value: pref.value,
                userId: pref.newUserId,
                companyId: pref.newCompanyId,
            });
        }
        return await this.raPreference.update(
            {
                name: pref.name,
                userId: pref.userId,
                companyId: pref.companyId
            },
            {
                value: pref.value,
                userId: pref.newUserId,
                companyId: pref.newCompanyId
            }
        );
    }

    public async reloadMessageFilter() {
        const messageFilter: RaPreference = await this.raPreference.findOne({
            name: "messageFilters",
            userId: 0,
            companyId: 0,
        });
        if (messageFilter) {
            this.messageValidatorService.setFilter(JSON.parse(messageFilter.value));
        }
        return {};
    }

    public async deletePreference(name: any, user: number, company: number) {
        return await this.raPreference.delete({ name, userId: user, companyId: company });
    }


    async findParsePrefs(userId: number) {
        const userPref = await this.raPreference.createQueryBuilder("pref")
            .where("pref.userId=:user and (pref.name in ('layout.prefs'))"
                , { user: userId })
            .getOne();
        if (userPref && userPref.value) {
            return JSON.parse(userPref.value);
        } else { return null; }
    }

    async findCompanyPrefs(compId: number) {
        let userPref = await this.raPreference.createQueryBuilder("pref")
            .where("pref.userId=:user and pref.companyId=:company and (pref.name in ('init.params'))"
                , { user: 0, company: compId })
            .getOne();
        if (!userPref) {
            userPref = await this.raPreference.createQueryBuilder("pref")
                .where("pref.userId=:user and pref.companyId=:company and (pref.name in ('init.params'))"
                    , { company: 0, user: 0 })
                .getOne();
        }
        if (userPref && userPref.value) {
            return JSON.parse(userPref.value);
        } else { return null; }
    }


}
