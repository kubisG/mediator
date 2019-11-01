import { EntityRepository, Repository } from "typeorm";
import { RaIoi } from "../../entity/ra-ioi";

@EntityRepository(RaIoi)
export class IoisRepository extends Repository<RaIoi> {

    public async getIois(dateFrom, dateTo, compId, userId, compOrders = false) {
        const queryBuilder = this.createQueryBuilder("ord");
        const selectBuilder = queryBuilder
            .where("((ord.createDate >= :dateFrom and ord.createDate <= :dateTo) or (ord.ValidUntilTime >= :dateFrom))"
                , { dateFrom, dateTo })
            .andWhere("ord.company = :compId", { compId })
            .orderBy("ord.id", "ASC");
        if (!compOrders) {
            selectBuilder.andWhere("(ord.user = :userId or ord.user is null)", { userId });
        }
        return await selectBuilder.getMany();
    }

}
