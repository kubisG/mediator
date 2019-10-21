import { Injectable, Inject } from "@nestjs/common";
import { OrderStoreRepository } from "../../dao/repositories/order-store.repository";

@Injectable()
export class DFDUpdateService {

    constructor(
        @Inject("orderStoreRepository") private raOrderStore: OrderStoreRepository,
    ) {

    }

    public async dfdUpdate(data: any) {
        return await this.raOrderStore.updateDFD(data);
    }
}
