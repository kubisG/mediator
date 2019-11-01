import { EntityRepository, Repository } from "typeorm";
import { RaOrderRel } from "../../entity/ra-order-rel";
import { Side } from "@ra/web-core-be/dist/enums/side.enum";

@EntityRepository(RaOrderRel)
export class OrderRelRepository extends Repository<RaOrderRel> {

    public async getChildsQty(compId: number, clOrdLinkID: string) {
        const queryBuilder = this.createQueryBuilder("ord");
        const selectBuilder = queryBuilder
            .select("sum(CASE WHEN ors.\"LeavesQty\">-1 THEN ors.\"LeavesQty\" ELSE ors.\"OrderQty\" END)", "qty")
            .leftJoin("ra_order_store", "ors", "ors.\"id\" = \"childId\"")
            .where("\"parentClOrdId\"=:clOrdLinkID", { clOrdLinkID })
            .andWhere("ord.company = :compId", { compId });

        const result = await selectBuilder.getRawOne();
        return result.qty;
    }

    public async getChildsPrice(compId: number, clOrdLinkID: string, side: string) {
        const queryBuilder = this.createQueryBuilder("ord");

        let selectBuilder = null;
        if (side === Side.Buy) {
            selectBuilder = queryBuilder
                .select("min(ors.Price)", "price")
                .leftJoin("ra_order_store", "ors", "ors.\"id\" = \"childId\"")
                .where("\"parentClOrdId\"=:clOrdLinkID", { clOrdLinkID })
                .andWhere("ord.company = :compId", { compId });
        } else {
            selectBuilder = queryBuilder
                .select("max(ors.Price)", "price")
                .leftJoin("ra_order_store", "ors", "ors.\"id\" = \"childId\"")
                .where("\"parentClOrdId\"=:clOrdLinkID", { clOrdLinkID })
                .andWhere("ord.company = :compId", { compId });
        }

        const result = await selectBuilder.getRawOne();
        return result.price;
    }

}
