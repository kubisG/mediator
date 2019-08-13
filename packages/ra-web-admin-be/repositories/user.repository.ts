import { EntityRepository, Repository } from "typeorm";
import { RaUser } from "@ra/web-core-be/src/db/entity/ra-user";

@EntityRepository(RaUser)
export class UserRepository extends Repository<RaUser> {

}
