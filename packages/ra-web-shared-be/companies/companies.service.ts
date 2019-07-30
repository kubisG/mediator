import { Inject, Injectable } from "@nestjs/common";

import { CompanyDto } from "./dto/companies.dto";
import { DbException } from "@ra/web-core-be/exceptions/db.exception";
import { prepareFilter } from "@ra/web-core-be/utils";
import { LightMapper } from "light-mapper";
import { EnvironmentService } from "@ra/web-env-be/environment.service";
import { AuthService } from "@ra/web-auth-be/auth.service";
import { UserData } from "../users/user-data.interface";
import { RaCompany } from "@ra/web-core-be/db/entity/ra-company";
import { CompanyRepository } from "@ra/web-core-be/dao/repositories/company.repository";
import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";

@Injectable()
export class CompaniesService {

    public companyCreated: Subject<any> = new Subject<any>();
    public companyCreated$: Observable<any> = this.companyCreated.asObservable();

    constructor(
        @Inject("companyRepository") private companyRep: CompanyRepository,
        public authService: AuthService,
        public env: EnvironmentService,
    ) { }

    async findAndCount(): Promise<[RaCompany[], number]> {
        return await this.companyRep.findAndCount();
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

            this.companyCreated.next( { result });
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
