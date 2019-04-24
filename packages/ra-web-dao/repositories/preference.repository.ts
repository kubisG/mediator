import { EntityRepository } from "typeorm";
import { RaPreference } from "../../core/db/entity/ra-preference";
import { BaseRepository } from "typeorm-transactional-cls-hooked";

@EntityRepository(RaPreference)
export class PreferenceRepository extends BaseRepository<RaPreference> {

    public async getUsersLayoutPrefs() {
        return await this.createQueryBuilder("pref")
            .where("pref.userId > 0 AND pref.companyId > 0 AND pref.name = 'layout.prefs'")
            .getMany();
    }

}
