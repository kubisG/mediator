import { EntityRepository, Repository } from "typeorm";
import { RaPreference } from "@ra/web-core-be/db/entity/ra-preference";

@EntityRepository(RaPreference)
export class PreferenceRepository extends Repository<RaPreference> {

    public async getUsersLayoutPrefs() {
        return await this.createQueryBuilder("pref")
            .where("pref.userId > 0 AND pref.companyId > 0 AND pref.name = 'layout.prefs'")
            .getMany();
    }

}
