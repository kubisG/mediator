import { Inject, Injectable } from "@nestjs/common";

import { CompanyDto } from "./dto/companies.dto";
import { DbException } from "@ra/web-core-be/dist/exceptions/db.exception";
import { prepareFilter } from "@ra/web-core-be/dist/utils";
import { LightMapper } from "light-mapper";
import { MessagesRouter } from "../messages/routing/messages-router";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { CompanyRepository } from "../dao/repositories/company.repository";
import { RaCompany } from "../entity/ra-company";
import { UserData } from "../users/user-data.interface";

@Injectable()
export class CompaniesService {

    constructor(
        @Inject("companyRepository") private companyRep: CompanyRepository,
        @Inject("brokerRouting") public brokerRouting: MessagesRouter,
        @Inject("traderRouting") public traderRouting: MessagesRouter,
        public authService: AuthService,
        public env: EnvironmentService,
    ) { }

    async findAndCount(skip: number, take: number,
        sortCol: string = "companyName", sortDir: string = "ASC", filter: any): Promise<[RaCompany[], number]> {

        const filt = await prepareFilter(filter, sortCol, "companyName", sortDir, "RaCompany");

        const records = await this.companyRep.createQueryBuilder()
            //            .where(filt.whereCl, filt.data)
            .skip(skip)
            .take(take)
            .orderBy(filt.orderBy)
            .getMany();
        const count = await this.companyRep.createQueryBuilder()
            //            .where(filt.whereCl, filt.data)
            .getCount();

        return [records, count];
    }

    async findOne(token: string, id: number): Promise<RaCompany> {
        const userData = await this.authService.getUserData<UserData>(token);
        if ((userData.role === "ADMIN") || (Number(userData.compId) === Number(id))) {
            return await this.companyRep.findOne({ id: id });
        } else {
            return null;
        }
    }

    async delete(id: any): Promise<any> {
        try {
            return await this.companyRep.delete({ id: id });
        } catch (ex) {
            throw new DbException(ex, "RaCompany");
        }
    }
    /**
     *
     * @param company
     */
    async create(company: CompanyDto): Promise<any> {
        try {
            const mapper = new LightMapper();
            const newCompany = mapper.map<RaCompany>(RaCompany, company);
            const result = await this.companyRep.save(newCompany);

            this.brokerRouting.initConsumeMessages(null, `${this.env.queue.prefixBroker}${result.id}`);
            this.traderRouting.initConsumeMessages(null, `${this.env.queue.prefixTrader}${result.id}`);
            return result;
        } catch (ex) {
            throw new DbException(ex, "RaCompany");
        }
    }

    /**
     *
     * @param id
     * @param company
     */
    async update(token: string, id: number, company: any): Promise<any> {
        try {
            const mapper = new LightMapper();
            const newCompany = mapper.map<RaCompany>(RaCompany, company);
            await this.companyRep.update({ id: id }, newCompany);
            return await this.findOne(token, id);
        } catch (ex) {
            throw new DbException(ex, "RaCompany");
        }
    }

    /**
     *
     * @param id
     * @param company
     */
    async myUpdate(token: string, id: number, company: any): Promise<any> {
        const userData = await this.authService.getUserData<UserData>(token);
        if (Number(userData.compId) === Number(id)) {
            try {
                const mapper = new LightMapper();
                const newCompany = mapper.map<RaCompany>(RaCompany, company);
                await this.companyRep.update({ id: id }, newCompany);
                return await this.findOne(token, id);
            } catch (ex) {
                throw new DbException(ex, "RaCompany");
            }
        } else {
            throw new DbException({ message: "No rights!" }, "RaCompany");
        }
    }


}
