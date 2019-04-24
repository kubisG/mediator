import { EntityRepository } from "typeorm";
import { RaAccounts } from "../../core/db/entity/ra-accounts";
import { BaseRepository } from "typeorm-transactional-cls-hooked";

@EntityRepository(RaAccounts)
export class AccountsRepository extends BaseRepository<RaAccounts> {

}
