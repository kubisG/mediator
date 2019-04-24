import { EntityRepository } from "typeorm";
import { RaUser } from "../../core/db/entity/ra-user";
import { BaseRepository } from "typeorm-transactional-cls-hooked";

@EntityRepository(RaUser)
export class UserRepository extends BaseRepository<RaUser> {

}
