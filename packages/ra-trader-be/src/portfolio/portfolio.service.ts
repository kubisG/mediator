import { Inject, Injectable } from "@nestjs/common";

import { DbException } from "@ra/web-core-be/dist/exceptions/db.exception";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { PortfolioRepository } from "../dao/repositories/portfolio.repository";
import { RaPortfolio } from "../entity/ra-portfolio";
import { UserData } from "../users/user-data.interface";

@Injectable()
export class PortfolioService {

    constructor(
        @Inject("portfolioRepository") private portfolioRep: PortfolioRepository,
        private authService: AuthService,
    ) { }


    async findAndCount(token: string, company: boolean = false): Promise<[RaPortfolio[], number]> {
        const userData = await this.authService.getUserData<UserData>(token);
        let zaznamy;
        if (company) {
            zaznamy = await this.portfolioRep.findAndCount({ where: { company: userData.compId }, relations: ["user"] });
        } else {
            zaznamy = await this.portfolioRep.findAndCount({
                where: { user: userData.userId, company: userData.compId }
                , relations: ["user"]
            });
        }

        return zaznamy;
    }

    async findOne(id: any): Promise<RaPortfolio> {
        return await this.portfolioRep.findOne({ id: id });
    }

    async update(id: number, portfolio: any, token: string): Promise<any> {
        const userData = await this.authService.getUserData<UserData>(token);
        portfolio.company = userData.compId;
        try {
            const oldMessage = await this.findOne(id);
            const updateMessage = { ...oldMessage, ...portfolio };
            await this.portfolioRep.update({ id: id, user: <any>userData.userId }, updateMessage);
        } catch (ex) {
            throw new DbException(ex, "RaPortfolio");
        }
    }
}
