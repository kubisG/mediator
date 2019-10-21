import { EntityRepository, Repository } from "typeorm";
import { RaCounterParty } from "../../entity/ra-counter-party";

@EntityRepository(RaCounterParty)
export class CounterPartyRepository extends Repository<RaCounterParty> {

}
