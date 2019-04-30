import { EntityRepository,  Repository} from "typeorm";
import { RaOrderRel } from "@ra/web-core-be/db/entity/ra-order-rel";


@EntityRepository(RaOrderRel)
export class OrderRelRepository extends  Repository<RaOrderRel> {

    public async getChildsQty(compId: number, clOrdLinkID: string) {
        const queryBuilder = this.createQueryBuilder("ord");
        const selectBuilder = queryBuilder
            .select("sum(CASE WHEN ors.\"LeavesQty\">-1 THEN ors.\"LeavesQty\" ELSE ors.\"OrderQty\" END)", "qty")
            .leftJoin("ra_order_store", "ors", "ors.\"id\" = \"childId\"")
            .where("\"parentClOrdId\"=:clOrdLinkID", { clOrdLinkID: clOrdLinkID })
            .andWhere("ord.company = :compId", { compId: compId });

        const result = await selectBuilder.getRawOne();
        return result.qty;
    }

}
