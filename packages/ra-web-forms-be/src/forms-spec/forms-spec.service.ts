import { Injectable, Inject } from "@nestjs/common";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { LightMapper } from "light-mapper";
import { SystemChannelService } from "../system-channel/system-channel.service";
import { FormsSpecRepository } from "../forms-dao/repositories/forms-spec.repository";
import { RaFormsSpec } from "../forms-dao/entity/ra-forms-specification";
import { UserData } from "@ra/web-shared-be/dist/users/user-data.interface";
import { In } from "typeorm";

@Injectable()
export class FormsSpecService {

    constructor(
        public authService: AuthService,
        public systemService: SystemChannelService,
        @Inject("logger") public logger: Logger,
        @Inject("formsSpecRepository") private formsSpecRep: (FormsSpecRepository | any),
    ) {
    }

    /**
     * Find many admin
     */
    public async findManyAdmin(token: string) {
        const userData = await this.authService.getUserData(token) as UserData;
        try {
            return await this.formsSpecRep.find({
                order: { id: "ASC" },
            });
        } catch (ex) {
            ex.userId = userData.userId;
            this.systemService.sendException(ex);
            this.logger.error(ex);
            return null;
        }
    }

    /**
     * Find many
     */
    public async findMany(token: string) {
        const userData = await this.authService.getUserData(token) as UserData;
        try {
            return await this.formsSpecRep.find({
                where: { companyId: In([0, userData.compId]) },
                order: { id: "ASC" },
            });
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
            return await this.formsSpecRep.findOne({ id, companyId: (userData.compId as any) });
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
            return await this.formsSpecRep.delete({ id, companyId: (userData.compId as any) });
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
            data.companyId = data.companyId || data.companyId  === 0 ? data.companyId : userData.compId;
            const mapper = new LightMapper();
            const newData = mapper.map<RaFormsSpec>(RaFormsSpec, data);
            if (data.type === "N") {
                delete newData.id;
                newData.createdBy = userData.nickName;
            } else {
                newData.id = data.id;
                newData.updatedBy = userData.nickName;
                newData.companyId = data.companyId;
            }
            const res = await this.formsSpecRep.save(newData);
            return await this.formsSpecRep.findOne({ id: res.id });
        } catch (ex) {
            ex.userId = userData.userId;
            this.systemService.sendException(ex);
            this.logger.error(ex);
            return null;
        }
    }
}
