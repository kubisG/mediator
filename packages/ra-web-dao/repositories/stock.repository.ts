import { EntityRepository,  Repository} from "typeorm";
import { RaStock } from "@ra/web-core-be/db/entity/ra-stock";


@EntityRepository(RaStock)
export class StockRepository extends  Repository<RaStock> {

}
