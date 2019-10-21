import { Injectable, Inject } from "@nestjs/common";
import { OrderStoreRepository } from "../../dao/repositories/order-store.repository";

@Injectable()
export class SleuthService {

    constructor(
        @Inject("orderStoreRepository") private raOrderStore: OrderStoreRepository,
    ) {

    }

    public async hasSleuth(data: any) {
        return await this.raOrderStore.hasSleuth(data.companyId, data.dateFrom, data.side, data.symbol);
    }
}
