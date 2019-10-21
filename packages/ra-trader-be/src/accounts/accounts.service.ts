import { Injectable, Inject } from "@nestjs/common";
import { Repository, Connection } from "typeorm";
import { DbException } from "@ra/web-core-be/dist/exceptions/db.exception";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { LightMapper } from "light-mapper";
import { AccountsDto } from "./dto/accounts.dto";
import { HttpCacheService } from "@ra/web-core-be/dist/http-cache.service";
import { AccountsRepository } from "../dao/repositories/accounts.repository";
import { RaAccounts } from "../entity/ra-accounts";
import { UserData } from "../users/user-data.interface";

@Injectable()
export class AccountsService {

    constructor(
        @Inject("accountsRepository") private raAccountsToken: AccountsRepository,
        private authService: AuthService,
        private httpCacheService: HttpCacheService
    ) { }

    public async geAccounts(token: string): Promise<RaAccounts[]> {
        const userData = await this.authService.getUserData<UserData>(token);
        return await this.raAccountsToken.find({ company: userData.compId });
    }

    public async findOne(id: number, token: string): Promise<RaAccounts> {
        const userData = await this.authService.getUserData<UserData>(token);
        return await this.raAccountsToken.findOne({ id: id, company: userData.compId });
    }

    public async delete(id: number, token: string): Promise<any> {
        const userData = await this.authService.getUserData<UserData>(token);
        try {
            this.httpCacheService.setClearCache(userData.compId);
            return await this.raAccountsToken.delete({ id: id, company: userData.compId });
        } catch (ex) {
            throw new DbException(ex, "RaAccounts");
        }
    }

    public async save(account: AccountsDto, token: string): Promise<any> {
        const userData = await this.authService.getUserData<UserData>(token);
        try {
            account.company = userData.compId;
            const mapper = new LightMapper();
            const newAccount = mapper.map<RaAccounts>(RaAccounts, account);
            this.httpCacheService.setClearCache(userData.compId);
            return await this.raAccountsToken.save(newAccount);
        } catch (ex) {
            throw new DbException(ex, "RaAccounts");
        }
    }

}
