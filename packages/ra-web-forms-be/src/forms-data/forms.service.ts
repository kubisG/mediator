import { Injectable, Inject } from "@nestjs/common";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { LightMapper } from "light-mapper";
import { RaFormsData } from "../forms-dao/entity/ra-forms-data";
import { FormsDataRepository } from "../forms-dao/repositories/forms-data.repository";
import { SystemChannelService } from "../system-channel/system-channel.service";
import { FormsSpecRepository } from "../forms-dao/repositories/forms-spec.repository";
import { UserData } from "@ra/web-shared-be/dist/users/user-data.interface";
import axios from "axios";
import { ExchangeDataRepository } from "../forms-dao/repositories/exchange-data.repository";
import { AuditTrailRepository } from "@ra/web-core-be/dist/dao/repositories/audit-trail.repository";
import { RulesDataRepository } from "../forms-dao/repositories/rules-data.repository";

@Injectable()
export class FormsService {

    constructor(
        public authService: AuthService,
        public systemService: SystemChannelService,
        @Inject("logger") public logger: Logger,
        @Inject("formsDataRepository") private formsDataRep: (FormsDataRepository | any),
        @Inject("formsSpecRepository") private formsSpecRep: (FormsSpecRepository | any),
        @Inject("auditTrailRepository") private auditTrailRep: (AuditTrailRepository | any),
        @Inject("rulesDataRepository") private rulesDataRep: (RulesDataRepository | any),
        @Inject("exchangeDataRepository") private exchangeDataRep: (ExchangeDataRepository | any),
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
            const results = await this.formsDataRep.getData(dateFrom, dateTo, userData.compId, typ);
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
            const results = await this.formsDataRep.find({ dataType: typ, subType: "SUB", company: (userData.compId as any) });
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
            return await this.formsDataRep.findOne({ id, company: (userData.compId as any) });
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
            const previous =  await this.formsDataRep.findOne({ id, company: (userData.compId as any) });
            await this.exchangeDataRep.saveRecord(id, "ra_forms_data", "D", previous.data) ;

            this.auditTrailRep.beforeDelete(id, "", "ra_forms_data", userData.nickName, userData.compId);

            const result = await this.formsDataRep.delete({ id, company: (userData.compId as any) });
            return result;
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
            const mapper = new LightMapper();
            const newData = mapper.map<RaFormsData>(RaFormsData, data);
            let previous;
            if (data.type === "N") {
                delete newData.id;
                newData.createdBy = userData.nickName;
                newData.clientId = userData.clientId;
            } else {
                newData.id = data.id;
                newData.updatedBy = userData.nickName;
                newData.clientId = userData.clientId;
                previous = await this.formsDataRep.findOne({ id: newData.id, company: (userData.compId as any) });
            }

            // const result = await this.soapService.getData(data.Symbol);
            // newData.wsResponse = (result as any).PensonResponse.PensonStatus;

            if (typeof newData.accounts === "object") {
                newData.accounts = JSON.stringify(newData.accounts);
            }

            Object.keys(data).forEach(key => {
                if (data[key] === null || data[key] === "" || data[key] === undefined) {
                    delete data[key];
                }
            });

            newData.data = data;

            const savedData = await this.formsDataRep.save(newData);
            await this.exchangeDataRep.saveRecord(savedData.id, "ra_forms_data", data.type === "N" ? "I" : "U", previous ? previous.data : null);
            if (data.type === "N") {
                this.auditTrailRep.afterInsert(savedData.id, savedData.data, "ra_forms_data", userData.nickName, userData.compId);
            } else {
                this.auditTrailRep.afterUpdate(savedData.id, savedData.data, "ra_forms_data", userData.nickName, userData.compId);
            }

            return savedData;
        } catch (ex) {
            ex.userId = userData.userId;
            this.systemService.sendException(ex);
            this.logger.error(ex);
            return null;
        }
    }

    /**
     * Find many
     * @param token
     */
    public async findLists(token: string) {
        const userData = await this.authService.getUserData(token) as UserData;
        try {
            return await this.formsSpecRep.find({
                where: { company: userData.compId },
                relations: ["company"], order: { id: "ASC" },
            });
        } catch (ex) {
            ex.userId = userData.userId;
            this.systemService.sendException(ex);
            this.logger.error(ex);
            return null;
        }
    }

    public async findList(token: string, key: string) {
        const userData = await this.authService.getUserData(token) as UserData;

        try {
            return await this.formsSpecRep.findOne({ dataType: key, company: (userData.compId as any) });
        } catch (ex) {
            this.systemService.sendException(ex);
            this.logger.error(ex);
            return null;
        }
    }

    public async getExternalData(token: string, data: any) {
        const userData = await this.authService.getUserData(token) as UserData;
        try {
            const res = await axios.get(data.url);
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

    public async findHistory(token, id) {
        const userData = await this.authService.getUserData(token) as UserData;

        try {
            return await this.auditTrailRep.find({
                where: { table: "ra_forms_data", recordId: id, company: (userData.compId as any) },
                order: {
                    id: "DESC",
                },
            });
        } catch (ex) {
            this.systemService.sendException(ex);
            this.logger.error(ex);
            return null;
        }
    }

    public async getTableData(token: string, table: string) {
        const userData = await this.authService.getUserData(token) as UserData;
        try {
            const dbResults = await this.rulesDataRep.find({
                where: { type: table }, order: { id: "ASC" },
            });
            const results = [];
            if (dbResults) {
                for (const result of dbResults) {
                    if (result.data) {
                        results.push(...JSON.parse(result.data));
                    }
                }
            }
            return await results;
        } catch (ex) {
            ex.userId = userData.userId;
            this.systemService.sendException(ex);
            this.logger.error(ex);
            return null;
        }
    }

}
