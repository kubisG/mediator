import { Repository, EntityRepository } from "typeorm";
import { RaAppDirectoryIntent } from "../entities/ra-app-directory-intent";

@EntityRepository(RaAppDirectoryIntent)
export class AppDirectoryIntentRepository extends Repository<RaAppDirectoryIntent> {

}
