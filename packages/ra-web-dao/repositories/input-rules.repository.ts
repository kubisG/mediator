import { EntityRepository,  Repository} from "typeorm";
import { RaInputRules } from "@ra/web-core-be/db/entity/ra-input-rules";


@EntityRepository(RaInputRules)
export class InputRulesRepository extends  Repository<RaInputRules> {

    public async getRules(compId) {
        return await this.manager.query(`WITH RECURSIVE cte AS (
            SELECT id,  "rootId", "parentId", label, value, name, "companyId", 1 as level
            FROM   ra_input_rules
            WHERE  "parentId" is null and ( "companyId"=$1 OR "companyId"=0 )
            UNION  ALL
            SELECT t.id, t."rootId", t."parentId", t.label, t.value, t.name, t."companyId", c.level + 1
            FROM   cte      c
            JOIN   ra_input_rules t ON t."parentId" = c.id
            )
          SELECT id,"rootId", "parentId", label,value,name, level
          FROM   cte
          WHERE  ( "companyId"=$1 OR "companyId"=0 )
          ORDER  BY level,id;`, [compId]);
    }
}
