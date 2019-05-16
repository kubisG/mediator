import { RaOrderStore } from "@ra/web-core-be/db/entity/ra-order-store";
import { EntityRepository, Repository } from "typeorm";
import { OrdStatus } from "@ra/web-core-be/enums/ord-status.enum";
import { TIF } from "@ra/web-core-be/enums/tif.enum";
import { OrderAllocated } from "@ra/web-core-be/enums/order-allocated.enum";
import { SpecType } from "@ra/web-core-be/enums/spec-type.enum";
import { Apps } from "@ra/web-core-be/enums/apps.enum";

@EntityRepository(RaOrderStore)
export class OrderStoreRepository extends Repository<RaOrderStore> {

    public async getOrdersForCancel(side: any[], compId, userId, filtr, ClientID) {
        const dateFrom = new Date();
        dateFrom.setHours(0, 0, 0, 0);
        const dateTo = new Date();
        dateTo.setHours(23, 59, 59, 99);
        const gtc = TIF.GoodTillCancel;
        const gtd = TIF.GoodTillDate;
        const queryBuilder = this.createQueryBuilder("ord");
        const selectBuilder = queryBuilder
            .where("ord.\"OrdStatus\" in (:...AordStatus)", {
                AordStatus:
                    [OrdStatus.New, OrdStatus.PartiallyFilled, OrdStatus.Replaced, OrdStatus.PendingNew, OrdStatus.PendingReplace]
            })
            .andWhere("((ord.\"createDate\" >= :dateFrom and ord.\"createDate\" <= :dateTo)"
                + " or (ord.\"TimeInForce\" IN (:gtd) and ord.\"ExpireDate\" >= NOW())"
                + " or (ord.\"TimeInForce\" IN (:gtc) and ord.\"OrdStatus\" not in (:...BordStatus)))"
                , {
                    dateFrom, dateTo, gtd, gtc, BordStatus:
                        [OrdStatus.Canceled]
                })
            .andWhere("ord.company = :compId", { compId: compId })
            .andWhere("ord.Side in (:...side)", { side: side });
        if (filtr === "personal") {
            selectBuilder.andWhere("ord.user = :userId", { userId: userId });
        }
        if (ClientID) {
            selectBuilder.andWhere("ord.\"ClientID\" = :clientId", { clientId: ClientID });
        }
        const result = await selectBuilder.getMany();
        for (let i = 0; i < result.length; i++) {
            if (result[i].JsonMessage) {
                const jsonMessage = JSON.parse(result[i].JsonMessage);
                for (const messid in jsonMessage) {
                    if ((messid) && (!result[i][messid])) {
                        result[i][messid] = jsonMessage[messid];
                    }
                }
                result[i].JsonMessage = null;
            }
        }
        return result;
    }

    public async getOrders(app, dateFrom, dateTo, compId, userId, compOrders, gtcGtd, clOrdLinkID?, isPhone?) {
        const queryBuilder = this.createQueryBuilder("ord");
        const selectBuilder = queryBuilder;

        const actDate = new Date();
        actDate.setHours(0, 0, 0, 0);

        if ((gtcGtd === "true" || gtcGtd === true) && (new Date(dateFrom).getTime() === actDate.getTime())) {
            const gtc = TIF.GoodTillCancel;
            const gtd = TIF.GoodTillDate;

            selectBuilder
                .where("(((ord.\"createDate\" >= :dateFrom and ord.\"createDate\" <= :dateTo)"
                    + " or (ord.\"TimeInForce\" IN (:gtd) and ord.\"ExpireDate\" >= NOW())"
                    + " or (ord.\"TimeInForce\" IN (:gtc) and ord.\"OrdStatus\" not in (:...ordStatus)))"
                    //                    + " and ord.\"OrdStatus\" not in (:done)"
                    + ")"
                    , {
                        dateFrom, dateTo, gtd, gtc, done: OrdStatus.DoneForDay, ordStatus:
                            [OrdStatus.Canceled]
                    });
        } else {
            selectBuilder
                .where("ord.\"createDate\" >= :dateFrom and ord.\"createDate\" <= :dateTo", { dateFrom, dateTo });
        }

        selectBuilder
            .andWhere("ord.company = :compId", { compId: compId })
            .andWhere("ord.app = :app", { app })
            .orderBy("ord.id", "ASC");
        if ((compOrders === "false" || compOrders === false) && (app !== Apps.broker)) {
            selectBuilder.andWhere("ord.user = :userId", { userId: userId });
        }
        if (isPhone === SpecType.phone) {
            selectBuilder.andWhere("ord.specType = :phone", { phone: SpecType.phone });
        }

        if (clOrdLinkID) {
            selectBuilder.andWhere(
                "ord.id in (select \"childId\" from ra_order_rel rl where rl.\"parentClOrdId\"=:clOrdLinkID and \"companyId\"=:compId)"
                , { clOrdLinkID: clOrdLinkID, compId: compId });
        }
        return await selectBuilder.getMany();
    }

    public async getAllocations(dateFrom, dateTo, compId, userId, filter, allmsgs) {

        const queryBuilder = this.createQueryBuilder("ord");
        const selectBuilder = queryBuilder
            .select("ord.*")
            // .select("concat(ord.id,o.id) unqid, ord.*,o.\"AllocID\",o.\"AllocTransType\",o.\"AllocShares\""
            //             + ",o.id allid, o.\"AllocAccount\",o.\"AllocStatus\",o.\"AllocText\",o.\"Commission\",o.\"CommType\"")
            //         .leftJoin(RaAllocation, "o", "ord.RaID = o.RaID")
            .where("ord.\"createDate\" >= :dateFrom and ord.\"createDate\" <= :dateTo", { dateFrom, dateTo })
            .andWhere("ord.\"OrdStatus\" = 'DoneForDay'")
            .andWhere("ord.company = :compId", { compId: compId })
            ;
        if (!allmsgs) {
            selectBuilder.andWhere("ord.\"Account\" is NULL"); // only orders not setup to Accounts
            selectBuilder.andWhere("(ord.\"Allocated\" is NULL or ord.\"Allocated\" = :sended  or ord.\"Allocated\" = :rejected)",
                { sended: OrderAllocated.Sended, rejected: OrderAllocated.Rejected }); // only orders not setup to Accounts
        }
        if (!filter) {
            selectBuilder.andWhere("ord.user = :userId", { userId: userId });
        }
        return await selectBuilder.orderBy("ord.id", "ASC").getRawMany();
    }


    public async getSleuth(companyId: number, dateFrom: Date, side: string, symbol: string) {
        const result = await this.createQueryBuilder("ord")
            .where("ord.\"Symbol\"=:symbol and app=:app and ord.\"Side\"=:side and ord.\"companyId\"=:comp"
                , { symbol: symbol, side: side, comp: companyId, app: Apps.broker })
            .andWhere("ord.\"createDate\" >= :dateFrom", { dateFrom })
            .andWhere("(ord.\"AvgPx\">0 OR ord.\"Price\">0)")
            .orderBy("ord.id", "DESC")
            .getMany();

        return result;
    }

    public async hasSleuth(companyId: number, dateFrom: Date, side: string, symbol: string) {
        return await this.createQueryBuilder("ord")
            .where("ord.\"Symbol\"=:symbol and app=:app and ord.\"Side\"=:side and ord.\"companyId\"=:comp"
                , { symbol: symbol, side: side, comp: companyId, app: Apps.broker })
            .andWhere("ord.\"createDate\" >= :dateFrom", { dateFrom })
            .andWhere("(ord.\"AvgPx\">0 OR ord.\"Price\">0)")
            .getCount();
    }


    public async getClients(companyId: number, app: number) {
        const dateFrom = new Date();
        dateFrom.setHours(0, 0, 0, 0);
        const dateTo = new Date();
        dateTo.setHours(23, 59, 59, 99);
        const gtc = TIF.GoodTillCancel;
        const gtd = TIF.GoodTillDate;

        return await this.createQueryBuilder("ord")
            .select("distinct ord.\"ClientID\"", "ClientID")
            .where("ord.\"ClientID\" is not null and ord.\"OrdStatus\" in (:...AordStatus)", {
                AordStatus:
                    [OrdStatus.New, OrdStatus.PartiallyFilled, OrdStatus.Replaced, OrdStatus.PendingNew, OrdStatus.PendingReplace]
            })
            .andWhere("((ord.\"createDate\" >= :dateFrom and ord.\"createDate\" <= :dateTo)"
                + " or (ord.\"TimeInForce\" IN (:gtd) and ord.\"ExpireDate\" >= NOW())"
                + " or (ord.\"TimeInForce\" IN (:gtc) and ord.\"OrdStatus\" not in (:...BordStatus)))"
                , {
                    dateFrom, dateTo, gtd, gtc, BordStatus:
                        [OrdStatus.Canceled]
                })
            .andWhere("ord.company = :compId", { compId: companyId })
            .andWhere("ord.app=:app", { app: app })
            .orderBy("ord.ClientID", "DESC")
            .getRawMany();
    }

    public async updateDFD(data: any) {
        const gtc = TIF.GoodTillCancel;
        const gtd = TIF.GoodTillDate;
        const orders = await this.createQueryBuilder("ord")
            .where("ord.\"OrdStatus\" = 'DoneForDay'"
                + " and ((ord.\"TimeInForce\" IN (:gtd) and ord.\"ExpireDate\" >= NOW())"
                + " or (ord.\"TimeInForce\" IN (:gtc)))",
                { gtd: gtd, gtc: gtc })
            .getMany();

        for (let i = 0; i < orders.length; i++) {
            let ordStatus = OrdStatus.DoneForDay;
            if ((orders[i].CumQty === 0) && (orders[i].LeavesQty > 0)) {
                ordStatus = OrdStatus.New;
            } else if ((orders[i].CumQty > 0) && (orders[i].LeavesQty > 0)) {
                ordStatus = OrdStatus.PartiallyFilled;
            }
            this.update({id: orders[i].id}, {OrdStatus: ordStatus});
        }
    }
}
