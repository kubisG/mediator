import { EntityRepository, Repository } from "typeorm";

import { MessageType } from "@ra/web-core-be/dist/enums/message-type.enum";
import { RaAllocationMessage } from "../../entity/ra-allocation-message";

@EntityRepository(RaAllocationMessage)
export class AllocationMessageRepository extends Repository<RaAllocationMessage> {

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
