import { EntityRepository } from "typeorm";
import { RaStock } from "../../core/db/entity/ra-stock";
import { BaseRepository } from "typeorm-transactional-cls-hooked";

@EntityRepository(RaStock)
export class StockRepository extends BaseRepository<RaStock> {

}
