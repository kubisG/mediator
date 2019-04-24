import { BaseRepository } from "typeorm-transactional-cls-hooked";
import { RaStock } from "../../core/db/entity/ra-stock";
import { EntityRepository } from "typeorm";

@EntityRepository(RaStock)
export class StockDataRepository extends BaseRepository<RaStock> {

}
