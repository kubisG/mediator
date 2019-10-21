import { Injectable, Inject } from "@nestjs/common";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { LightMapper } from "light-mapper";
import { SystemChannelService } from "../system-channel/system-channel.service";
import { FormsSpecRepository } from "../forms-dao/repositories/forms-spec.repository";
import { RaFormsSpec } from "../forms-dao/entity/ra-forms-specification";
import { UserData } from "@ra/web-shared-be/dist/users/user-data.interface";

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
     * Find many
     * @param token
     */
    public async findMany(token: string) {
        const userData = await this.authService.getUserData(token) as UserData;
        try {
            return await this.formsSpecRep.find({
                relations: ["company"], order: { id: "ASC" },
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
            return await this.formsSpecRep.findOne({ id, company: (userData.compId as any) });
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
            return await this.formsSpecRep.delete({ id, company: (userData.compId as any) });
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
            data.company = data.company ? data.company.id : userData.compId;
            const mapper = new LightMapper();
            const newData = mapper.map<RaFormsSpec>(RaFormsSpec, data);
            if (data.type === "N") {
                delete newData.id;
                newData.createdBy = userData.nickName;
            } else {
                newData.id = data.id;
                newData.updatedBy = userData.nickName;
            }

            const res = await this.formsSpecRep.save(newData);
            return await this.formsSpecRep.findOne({ where: { id: res.id }, relations: ["company"] });
        } catch (ex) {
            ex.userId = userData.userId;
            this.systemService.sendException(ex);
            this.logger.error(ex);
            return null;
        }
    }
}
