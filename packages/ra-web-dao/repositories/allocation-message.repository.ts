import { EntityRepository,  Repository} from "typeorm";
import { RaAllocationMessage } from "@ra/web-core-be/db/entity/ra-allocation-message";

import { MessageType } from "@ra/web-core-be/enums/message-type.enum";

@EntityRepository(RaAllocationMessage)
export class AllocationMessageRepository extends  Repository<RaAllocationMessage> {

    public async getBrokerAllocations(dateFrom, dateTo, compId) {
        const queryBuilder = this.createQueryBuilder("ord");
        const selectBuilder = queryBuilder
            .where("ord.\"TransactTime\" >= :dateFrom and ord.\"TransactTime\" <= :dateTo", { dateFrom, dateTo })
            .andWhere("ord.\"companyId\" = :compId", { compId: compId })
            .andWhere("ord.\"msgType\" = :msgType", { msgType: MessageType.Allocation })
            .orderBy("ord.id", "ASC");

        return await selectBuilder.getMany();
    }

}
