import { EntityRepository,  Repository} from "typeorm";
import { RaAllocation } from "@ra/web-core-be/db/entity/ra-allocation";


@EntityRepository(RaAllocation)
export class AllocationsRepository extends  Repository<RaAllocation> {

}
