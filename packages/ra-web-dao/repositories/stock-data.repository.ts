
import { RaStock } from "@ra/web-core-be/db/entity/ra-stock";
import { EntityRepository,  Repository} from "typeorm";

@EntityRepository(RaStock)
export class StockDataRepository extends  Repository<RaStock> {

}
