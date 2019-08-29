import { Inject, Injectable } from "@nestjs/common";

import { DbException } from "@ra/web-core-be/dist/exceptions/db.exception";
import { UserData } from "../users/user-data.interface";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { ObjectRightsRepository } from "@ra/web-core-be/dist/dao/repositories/object-rights.repository";
import { UserRepository } from "@ra/web-core-be/dist/dao/repositories/user.repository";
import { RaObjectRights } from "@ra/web-core-be/dist/db/entity/ra-object-rights";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";

@Injectable()
export class ObjectRightsService {

    constructor(
        @Inject("objectRightsRepository") private raObjectRights: ObjectRightsRepository,
        @Inject("userRepository") private raUser: UserRepository,
        private authService: AuthService,
        private env: EnvironmentService,
    ) { }

    async getObjectRight(token: string, name: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        const right = await this.raObjectRights.findOne({
            name, userId: userData.userId, companyId: userData.compId,
        });
        return right;
    }

    async getUserRights(token: string) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        const rights = await this.raObjectRights.find({
            userId: userData.userId, companyId: userData.compId,
        });
        return rights;
    }

    async findAll(token) {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        return await this.raObjectRights.find();
    }

    async saveRight(rights: any, token: string): Promise<any> {
        const userData: UserData = await this.authService.getUserData<UserData>(token);
        try {
            const newRecord = new RaObjectRights();
            newRecord.id = rights.id;
            newRecord.name = rights.name;
            newRecord.userId = rights.newUserId;
            newRecord.companyId = rights.newCompanyId;
            newRecord.read = rights.read;
            newRecord.write = rights.write;
            return await this.raObjectRights.save(newRecord);
        } catch (ex) {
            throw new DbException(ex, "RaObjectRights");
        }
    }

    public async deleteRight(id: number) {
        return await this.raObjectRights.delete({ id });
    }

}
