import { EntityRepository, Repository } from "typeorm";
import { RaUser } from "@ra/web-core-be/dist/db/entity/ra-user";

@EntityRepository(RaUser)
export class UserRepository extends Repository<RaUser> {

}
