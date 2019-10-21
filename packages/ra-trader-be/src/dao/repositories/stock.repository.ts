import { EntityRepository, Repository } from "typeorm";
import { RaStock } from "../../entity/ra-stock";

@EntityRepository(RaStock)
export class StockRepository extends Repository<RaStock> {

}
