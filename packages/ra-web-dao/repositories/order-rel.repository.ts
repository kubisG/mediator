import { EntityRepository } from "typeorm";
import { RaOrderRel } from "../../core/db/entity/ra-order-rel";
import { BaseRepository } from "typeorm-transactional-cls-hooked";

@EntityRepository(RaOrderRel)
export class OrderRelRepository extends BaseRepository<RaOrderRel> {

    public async getChildsQty(compId: number, clOrdLinkID: string) {
        const queryBuilder = this.createQueryBuilder("ord");
        const selectBuilder = queryBuilder
            .select("sum(ord.\"OrderQty\")" , "qty")
            .where("ord.company = :compId", { compId: compId })
            .andWhere("\"parentClOrdId\"=:clOrdLinkID", { clOrdLinkID: clOrdLinkID });

        const result = await selectBuilder.getRawOne();
        return result.qty;
    }

}
