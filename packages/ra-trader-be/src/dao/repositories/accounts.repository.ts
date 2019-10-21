import { EntityRepository, Repository } from "typeorm";
import { RaAccounts } from "../../entity/ra-accounts";

@EntityRepository(RaAccounts)
export class AccountsRepository extends Repository<RaAccounts> {

}
