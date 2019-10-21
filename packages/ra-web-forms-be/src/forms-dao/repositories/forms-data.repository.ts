
import { EntityRepository, Repository, AbstractRepository } from "typeorm";
import { RaFormsData } from "../entity/ra-forms-data";

export class FormsDataRepository{

    private repo;

    constructor(repo: Repository<RaFormsData>) {
        this.repo = repo;
    }

    public async getData(dateFrom, dateTo, compId, typ): Promise<any> {
        const queryBuilder = this.repo.createQueryBuilder("ord");
        const selectBuilder = queryBuilder;

        selectBuilder
            .andWhere("ord.company = :compId", { compId })
            .andWhere("ord.subType = :subTyp", { subTyp: "MAIN" })
            .orderBy("ord.id", "ASC");
        if (typ && typ !== "undefined") {
            selectBuilder
                .andWhere("ord.dataType = :typ", { typ });
        }
        return selectBuilder.getMany();
    }
}
