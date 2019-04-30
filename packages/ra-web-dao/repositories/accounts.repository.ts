import { EntityRepository,  Repository} from "typeorm";
import { RaAccounts } from "@ra/web-core-be/db/entity/ra-accounts";

@EntityRepository(RaAccounts)
export class AccountsRepository extends Repository<RaAccounts> {

}
