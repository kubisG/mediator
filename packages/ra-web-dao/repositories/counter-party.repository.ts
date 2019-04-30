import { EntityRepository,  Repository} from "typeorm";

import { RaCounterParty } from "@ra/web-core-be/db/entity/ra-counter-party";

@EntityRepository(RaCounterParty)
export class CounterPartyRepository extends  Repository<RaCounterParty> {

}
