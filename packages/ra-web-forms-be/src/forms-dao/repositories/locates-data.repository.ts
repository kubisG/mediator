
import { Repository } from "typeorm";
import { RaLocatesData } from "../entity/ra-locates-data";
import { LocatesStatus } from "../../locates-data/locates-status.enum";

export class LocatesDataRepository {

    private repo;

    constructor(repo: Repository<RaLocatesData>) {
        this.repo = repo;
    }

    public async getLocates(clientId, symbol, broker, status = true): Promise<any> {
        const selectBuilder = await this.repo.createQueryBuilder("ord");
        selectBuilder
            .select("ord.*")
            .where("ord.symbol like '%'||:symbol||'%'", {
                symbol,
            })
            .andWhere("ord.broker like '%'||:broker||'%'", {
                broker,
            })
            .andWhere("ord.clientId = :clientId", {
                clientId,
            });
        if (status) {
            selectBuilder
                .andWhere("ord.status in ('New','Used')");
        } else {
            selectBuilder
                .andWhere("ord.status not in ('Expired')");
        }
        selectBuilder
            .orderBy("ord.id");
        return selectBuilder.getRawMany();
    }

    public async getData(dateFrom, dateTo, compId, status): Promise<any> {

        const ddateFrom = new Date();
        ddateFrom.setHours(0, 0, 0, 0);

        const ddateTo = new Date();
        ddateTo.setHours(23, 59, 59, 99);

        const queryBuilder = this.repo.createQueryBuilder("ord");
        const selectBuilder = queryBuilder;

        selectBuilder
            .andWhere("ord.company = :compId", { compId })
            .andWhere("ord.\"createDate\" >= :dateFrom and ord.\"createDate\" <= :dateTo", {
                dateFrom: dateFrom ? dateFrom : ddateFrom,
                dateTo: dateTo ? dateTo : ddateTo,
            })
            //            .andWhere("ord.status = :status", { status })
            .orderBy("ord.id", "ASC");
        return selectBuilder.getMany();
    }

    public async setExpiredLocates(): Promise<any> {
        const today = new Date();

        const queryBuilder = await this.repo.createQueryBuilder("ord");
        queryBuilder
            .update(RaLocatesData)
            .set({
                status: LocatesStatus.Expired,
                availableShares: 0,
                updatedDate: today,
            })
            .where("status <> :expired and \"availableShares\">0", { expired: LocatesStatus.Expired})
            .andWhere("createDate < :today", { today })
            .execute();

        const selectBuilder = this.repo.createQueryBuilder("ord");
        selectBuilder
            .select("DISTINCT(ord.company) comp")
            .where("ord.\"updatedDate\" >= :dateFrom", {
                dateFrom: today,
            })
            .andWhere("ord.status = :expired", { expired: LocatesStatus.Expired});
        return selectBuilder.getRawMany();
    }
}
