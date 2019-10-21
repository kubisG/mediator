import { Injectable, Inject } from "@nestjs/common";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { LightMapper } from "light-mapper";
import { LocatesDataRepository } from "../forms-dao/repositories/locates-data.repository";
import { SystemChannelService } from "../system-channel/system-channel.service";
import { DataService } from "./data.service";
import { UserData } from "@ra/web-shared-be/dist/users/user-data.interface";
import { RaLocatesData } from "../forms-dao/entity/ra-locates-data";
import { ExchangeDataRepository } from "../forms-dao/repositories/exchange-data.repository";
import { AuditTrailRepository } from "@ra/web-core-be/dist/dao/repositories/audit-trail.repository";
import { LocatesStatus } from "./locates-status.enum";

@Injectable()
export class LocatesService {

    constructor(
        public authService: AuthService,
        public systemService: SystemChannelService,
        @Inject("logger") public logger: Logger,
        @Inject("locatesDataRepository") private locatesDataRep: (LocatesDataRepository | any),
        @Inject("auditTrailRepository") private auditTrailRep: (AuditTrailRepository | any),
        @Inject("exchangeDataRepository") private exchangeDataRep: (ExchangeDataRepository | any),
        public dataService: DataService,
    ) {
    }

    /**
     * TODO : split & validace
     * @param data
     * @param token
     */
    public async findMany(token: string, dates: any, typ: string) {
        const userData = await this.authService.getUserData(token) as UserData;

        const datesArr = dates.split("~");
        const dateFrom = datesArr[0];
        let dateTo;
        if (datesArr.length < 2) {
            dateTo = datesArr[0];
        } else {
            dateTo = datesArr[1];
        }

        try {
            const results = await this.locatesDataRep.getData(dateFrom, dateTo, userData.compId, typ);
            return results;
        } catch (ex) {
            ex.userId = userData.userId;
            this.systemService.sendException(ex);
            this.logger.error(ex);
            return null;
        }
    }

    public async getRules(token: string, typ: string) {
        const userData = await this.authService.getUserData(token) as UserData;
        try {
            const results = await this.locatesDataRep.find({ dataType: typ, subType: "SUB", company: (userData.compId as any) });
            return results;
        } catch (ex) {
            ex.userId = userData.userId;
            this.systemService.sendException(ex);
            this.logger.error(ex);
            return null;
        }
    }

    public async findOne(token: string, id: number) {
        const userData = await this.authService.getUserData(token) as UserData;

        try {
            return await this.locatesDataRep.findOne({ id, company: (userData.compId as any) });
        } catch (ex) {
            ex.userId = userData.userId;
            this.systemService.sendException(ex);
            this.logger.error(ex);
            return null;
        }
    }

    public async delete(token: string, id: any) {
        const userData = await this.authService.getUserData(token) as UserData;
        try {
            const previous = await this.locatesDataRep.findOne({ id, company: (userData.compId as any) });
            await this.exchangeDataRep.saveRecord(id, "ra_locates_data", "D", previous);

            this.auditTrailRep.beforeDelete(id, "", "ra_locates_data", userData.nickName, userData.compId);
            return await this.locatesDataRep.delete({ id, company: (userData.compId as any), status: LocatesStatus.New });
        } catch (ex) {
            ex.userId = userData.userId;
            this.systemService.sendException(ex);
            this.logger.error(ex);
            return null;
        }
    }

    /**
     *
     * @param company
     */
    public async saveData(token: string, data: any) {
        const userData = await this.authService.getUserData(token) as UserData;
        try {
            data.company = userData.compId;
            data.user = userData.nickName;
            const mapper = new LightMapper();
            const newData = mapper.map<RaLocatesData>(RaLocatesData, data);
            let previous;
            if (data.type === "N") {
                delete newData.id;
                newData.clientId = userData.clientId;
                newData.status = LocatesStatus.New;
                newData.createdBy = userData.nickName;
                newData.availableShares = data.quantity;
            } else {
                newData.id = data.id;
                newData.clientId = userData.clientId;
                newData.updatedBy = userData.nickName;
                // we dont want to update this, only quantity
                delete newData.symbol;
                delete newData.status;
                delete newData.broker;

                previous = await this.locatesDataRep.findOne({
                    select: ["id", "reqType", "symbol", "broker", "quantity", "clientId"]
                    , where: { id: newData.id, company: (userData.compId as any) },
                });
                newData.availableShares = newData.availableShares + (data.quantity - previous.quantity);
                previous.broker = previous.broker ? JSON.parse(previous.broker) : previous.broker;
                previous.symbol = previous.symbol ? JSON.parse(previous.symbol) : previous.symbol;
            }

            const savedData = await this.locatesDataRep.save(newData);
            if (data.type !== "N") {
                delete savedData.createDate;
            }

            await this.exchangeDataRep.saveRecord(savedData.id, "ra_locates_data", data.type === "N" ? "I" : "U", previous ? previous : null);

            if (data.type === "N") {
                this.auditTrailRep.afterInsert(savedData.id, savedData, "ra_locates_data", userData.nickName, userData.compId);
            } else {
                this.auditTrailRep.afterUpdate(savedData.id, savedData, "ra_locates_data", userData.nickName, userData.compId);
            }

            return savedData;
        } catch (ex) {
            ex.userId = userData.userId;
            this.systemService.sendException(ex);
            this.logger.error(ex);
            return null;
        }
    }

    public async getExternalData(token: string, data: any) {
        const userData = await this.authService.getUserData(token) as UserData;
        try {
            const res = await this.dataService.getExternalData(data);
            if (!res.data) {
                this.logger.error(res);
                this.systemService.sendException({ message: res.statusText, userId: userData.userId });
                return null;
            } else if (!Array.isArray(res.data)) {
                this.logger.error("Bad array!", res.data);
                this.systemService.sendException({ message: "Bad array!", userId: userData.userId });
                return null;
            }
            return res.data;
        } catch (ex) {
            ex.userId = userData.userId;
            this.logger.error(ex);
            ex.message = ex.message + " - " + ex.config.url;
            this.systemService.sendException(ex);
            return null;
        }
    }
}
