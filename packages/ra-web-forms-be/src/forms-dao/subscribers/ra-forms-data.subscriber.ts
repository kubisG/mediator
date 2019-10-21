import { Injectable, Inject } from "@nestjs/common";
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent } from "typeorm";
import { RaFormsData } from "../entity/ra-forms-data";
import { AuditTrailRepository } from "@ra/web-core-be/dist/dao/repositories/audit-trail.repository";
import { RaAuditTrail } from "@ra/web-core-be/dist/db/entity/ra-audit-trail";

@EventSubscriber()
export class RaFormsDataSubscriber implements EntitySubscriberInterface <RaFormsData> {
/**
 * Not used now
 */

    listenTo() {
        return RaFormsData;
    }
    /**
     * Called after entity insertion.
     */
    async afterInsert(event: InsertEvent<any>) {
        // const repo = await event.manager.getRepository(RaAuditTrail);

        // const record = new RaAuditTrail();
        // record.action = "Insert";
        // record.user = event.entity.createdBy;
        // record.companyId = event.entity.company.id;
        // record.data = event.entity.data;
        // repo.save(record);
    }

    /**
     * Called after entity insertion.
     */
    async afterUpdate(event: UpdateEvent<any>) {
        // const repo = await event.manager.getRepository(RaAuditTrail);

        // const record = new RaAuditTrail();
        // record.action = "Update";
        // record.user = event.entity.updatedBy;
        // record.companyId = event.entity.company.id;
        // record.data = event.entity.data;
        // repo.save(record);
    }

    /**
     * Called after entity insertion.
     */
    async beforeRemove(event: RemoveEvent<any>) {

    }

}
