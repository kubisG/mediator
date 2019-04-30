import { RaPortfolio } from "@ra/web-core-be/db/entity/ra-portfolio";
import { EntityRepository,  Repository} from "typeorm";


@EntityRepository(RaPortfolio)
export class PortfolioRepository extends  Repository<RaPortfolio> {

    /**
     * Not used now
     * @param compId comapny
     * @param userId user
     * @param compOrders show al users
     */
    public async getAccountPortfolio(compId, userId, compOrders: string) {
        const queryBuilder = this.createQueryBuilder("ord");
        const selectBuilder = queryBuilder
            .andWhere("ord.company = :compId", { compId: compId })
            .orderBy("ord.id", "DESC");

        if (compOrders === "false") {
            selectBuilder.andWhere("ord.user = :userId", { userId: userId });
        }

        return await selectBuilder.getManyAndCount();
    }
}
