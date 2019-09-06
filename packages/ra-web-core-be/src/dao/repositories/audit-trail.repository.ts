import { EntityRepository, Repository } from "typeorm";
import { RaAuditTrail } from "../../db/entity/ra-audit-trail";
import { Audit } from "../../enums/audit.enum";

@EntityRepository(RaAuditTrail)
export class AuditTrailRepository extends Repository<RaAuditTrail> {

    public afterInsert(id: number, data: any, table: any, user: any, company: any) {
        const record = new RaAuditTrail();
        record.recordId = id;
        record.action = Audit.Insert;
        record.user = user;
        record.table = table;
        record.companyId = company;
        record.data = data;
        this.insert(record);
    }

    public afterUpdate(id: number, data: any, table: any, user: any, company: any) {
        const record = new RaAuditTrail();
        record.recordId = id;
        record.action = Audit.Update;
        record.user = user;
        record.table = table;
        record.companyId = company;
        record.data = data;
        this.insert(record);
    }

    public beforeDelete(id: number, data: any, table: any, user: any, company: any) {
        const record = new RaAuditTrail();
        record.recordId = id;
        record.action = Audit.Delete;
        record.user = user;
        record.table = table;
        record.companyId = company;
        record.data = "";
        this.insert(record);
    }

}
