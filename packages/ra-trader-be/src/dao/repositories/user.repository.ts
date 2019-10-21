import { EntityRepository, Repository } from "typeorm";
import { RaUser } from "../../entity/ra-user";

@EntityRepository(RaUser)
export class UserRepository extends Repository<RaUser> {

}
