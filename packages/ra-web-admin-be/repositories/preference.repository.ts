import { EntityRepository, Repository } from "typeorm";
import { RaPreference } from "@ra/web-core-be/src/db/entity/ra-preference";

@EntityRepository(RaPreference)
export class PreferenceRepository extends Repository<RaPreference> {
     
}
