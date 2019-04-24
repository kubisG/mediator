import { Injectable, Inject } from "@nestjs/common";
import { Repository } from "typeorm";
import { RaPreference } from "./db/entity/ra-preference";

@Injectable()
export class PreferencesService {

    constructor(
        @Inject("raPreferenceToken") private raPreference: Repository<RaPreference>,
    ) { }

    async findPrefs(userId: number) {
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
