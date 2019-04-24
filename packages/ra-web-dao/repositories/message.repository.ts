import { BaseRepository } from "typeorm-transactional-cls-hooked";
import { RaMessage } from "../../core/db/entity/ra-message";
import { EntityRepository } from "typeorm";

@EntityRepository(RaMessage)
export class MessageRepository extends BaseRepository<RaMessage> {

}
