import { EntityRepository, Repository } from "typeorm";
import { RaInputRules } from "../../entity/ra-input-rules";

@EntityRepository(RaInputRules)
export class InputRulesRepository extends Repository<RaInputRules> {

    public async getRules(compId) {
        return await this.manager.query(`
        WITH RECURSIVE cte AS (
          SELECT raie.relid , raie."childId", raie."rootId", raie."parentId", raie."companyId", 1 as level
          FROM   ra_input_relations raie
          WHERE  raie."parentId" is null and ( raie."companyId"=$1 OR raie."companyId"=0 )
          UNION  ALL
          SELECT raie.relid,raie."childId", raie."rootId", raie."parentId", raie."companyId", c.level + 1
          FROM   cte      c
          JOIN   ra_input_relations raie ON raie."parentId" = c.relid
          )
        SELECT c.relid, c."childId" id, c."rootId", c."parentId", c."companyId", c.level, rair."name", rair.value, rair."label"
        FROM   cte c
        JOIN ra_input_rules rair ON rair.id=c."childId"
        WHERE ( c."companyId"=$1 OR c."companyId"=0 )
        ORDER  BY level,relid;`, [compId]);

        // return await this.manager.query(`WITH RECURSIVE cte AS (
        //     SELECT id,  "rootId", "parentId", label, value, name, "companyId", 1 as level
        //     FROM   ra_input_rules
        //     WHERE  "parentId" is null and ( "companyId"=$1 OR "companyId"=0 )
        //     UNION  ALL
        //     SELECT t.id, t."rootId", t."parentId", t.label, t.value, t.name, t."companyId", c.level + 1
        //     FROM   cte      c
        //     JOIN   ra_input_rules t ON t."parentId" = c.id
        //     )
        //   SELECT id,"rootId", "parentId", label,value,name, level
        //   FROM   cte
        //   WHERE  ( "companyId"=$1 OR "companyId"=0 )
        //   ORDER  BY level,id;`, [compId]);
    }


    public async getInputRules(compId?: number, type?: string) {
        const query = `SELECT relid, c."childId" id, c."rootId", c."parentId", c."companyId", rair."name", rair.value, rair."label"
         FROM   ra_input_relations c
         JOIN ra_input_rules rair ON rair.id=c."childId"` + (compId ? ` WHERE ( c."companyId"=$1 OR c."companyId"=0 )` : ``)
            + (type ? ` AND ( rair."label"=$2 )` : ``)
            + ` ORDER  BY relid;`;

        console.log(query);

        const arg = [];
        if (compId) {
            arg.push(compId);
        }
        if (type) {
            arg.push(type);
        }



        return await this.manager.query(query, arg);
    }
}
