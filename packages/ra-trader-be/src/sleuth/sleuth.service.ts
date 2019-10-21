import { Inject, Injectable } from "@nestjs/common";

import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { Side } from "@ra/web-core-be/dist/enums/side.enum";
import { OrderStoreRepository } from "../dao/repositories/order-store.repository";
import { UserData } from "../users/user-data.interface";

@Injectable()
export class SleuthService {
    constructor(
        @Inject("orderStoreRepository") private raOrderStore: OrderStoreRepository,
        private authService: AuthService,
    ) { }

    async getSleuthData(token: string, side: string, symbol: string) {
        const userData = await this.authService.getUserData<UserData>(token);
        const dateFrom = new Date();
        dateFrom.setMonth(dateFrom.getMonth() - 6);

        return await this.raOrderStore.getSleuth(userData.compId, dateFrom, side === Side.Buy ? Side.Sell : Side.Buy, symbol);
    }
}
