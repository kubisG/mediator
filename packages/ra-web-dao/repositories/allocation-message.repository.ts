import { EntityRepository } from "typeorm";
import { RaAllocationMessage } from "../../core/db/entity/ra-allocation-message";
import { BaseRepository } from "typeorm-transactional-cls-hooked";
import { MessageType } from "../../core/enums/message-type.enum";

@EntityRepository(RaAllocationMessage)
export class AllocationMessageRepository extends BaseRepository<RaAllocationMessage> {

    public async getBrokerAllocations(dateFrom, dateTo, compId) {
        const queryBuilder = this.createQueryBuilder("ord");
        const selectBuilder = queryBuilder
            .where("ord.createDate >= :dateFrom and ord.createDate <= :dateTo", { dateFrom, dateTo })
            .andWhere("ord.company = :compId", { compId: compId })
            .andWhere("ord.msgType = :msgType", { msgType: MessageType.Allocation })
            .orderBy("ord.id", "ASC");

        return await selectBuilder.getMany();
    }

}
