import { Injectable, Inject } from "@nestjs/common";
import { DbException } from "@ra/web-core-be/dist/exceptions/db.exception";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { LightMapper } from "light-mapper";
import { CounterPartyDto } from "./dto/counter-party.dto";
import { HttpCacheService } from "@ra/web-core-be/dist/http-cache.service";
import { CounterPartyRepository } from "../dao/repositories/counter-party.repository";
import { RaCounterParty } from "../entity/ra-counter-party";
import { UserData } from "../users/user-data.interface";

@Injectable()
export class CounterPartyService {

    constructor(
        @Inject("counterPartyRepository") private raCounterPartyToken: CounterPartyRepository,
        private authService: AuthService,
        private httpCacheService: HttpCacheService,
    ) { }

    public async getCounterParties(token: string, type?: number): Promise<RaCounterParty[]> {
        const userData = await this.authService.getUserData<UserData>(token);
        if (type) {
            return await this.raCounterPartyToken.find({ company: userData.compId, type });

        } else {
            return await this.raCounterPartyToken.find({ company: userData.compId });
        }
    }

    public async findOne(id: number, token: string): Promise<RaCounterParty> {
        const userData = await this.authService.getUserData<UserData>(token);
        return await this.raCounterPartyToken.findOne({ id, company: userData.compId });
    }

    public async delete(id: number, token: string): Promise<any> {
        const userData = await this.authService.getUserData<UserData>(token);
        try {
            this.httpCacheService.setClearCache(userData.compId);
            return await this.raCounterPartyToken.delete({ id, company: userData.compId });
        } catch (ex) {
            throw new DbException(ex, "RaCounterParty");
        }
    }

    public async save(party: CounterPartyDto, token: string): Promise<any> {
        const userData = await this.authService.getUserData<UserData>(token);
        try {
            const mapper = new LightMapper();
            party.company = userData.compId;
            const newAccount = mapper.map<RaCounterParty>(RaCounterParty, party);
            this.httpCacheService.setClearCache(userData.compId);
            return await this.raCounterPartyToken.save(newAccount);
        } catch (ex) {
            throw new DbException(ex, "RaCounterParty");
        }
    }

}
