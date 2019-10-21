
import { EntityRepository, Repository, AbstractRepository } from "typeorm";
import { RaExchangeData } from "../entity/ra-exhange-data";

export class ExchangeDataRepository {

    private repo;

    constructor(repo: Repository<RaExchangeData>) {
        this.repo = repo;
    }

    public async saveRecord(id, table, type, previousRecord): Promise<any> {

        if (previousRecord && previousRecord instanceof Object) {
            Object.keys(previousRecord).forEach(key => {
                if (previousRecord[key] === null || previousRecord[key] === "" || previousRecord[key] === undefined) {
                    delete previousRecord[key];
                }
            });
        }

        const record = new RaExchangeData();
        record.recordId = id;
        record.table = table;
        record.type = type;
        record.status = "New";
        record.previousRecord = previousRecord;
        return await this.repo.save(record);

    }
}
