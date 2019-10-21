import { OrdStatus } from "@ra/web-core-be/dist/enums/ord-status.enum";

export class OrderStatusPriority {

    private statusPriority = {};

    constructor() {
        this.initStatusPriority();
    }

    private initStatusPriority() {
        this.statusPriority[OrdStatus.New] = { weight: 2 };
        this.statusPriority[OrdStatus.Canceled] = { weight: 4 };
        this.statusPriority[OrdStatus.DoneForDay] = { weight: 9 };
        this.statusPriority[OrdStatus.Filled] = { weight: 7 };
        this.statusPriority[OrdStatus.PartiallyFilled] = { weight: 3 };
        this.statusPriority[OrdStatus.PendingCancel] = { weight: 11 };
        this.statusPriority[OrdStatus.PendingNew] = { weight: 2 };
        this.statusPriority[OrdStatus.PendingReplace] = { weight: 10 };
        this.statusPriority[OrdStatus.Rejected] = { weight: 2 };
        this.statusPriority[OrdStatus.Replaced] = { weight: 2 };
    }

    public getHeavierStatus(msg1: any, msg2: any): string | undefined {
        if (!this.statusPriority[msg1.OrdStatus] || !this.statusPriority[msg2.OrdStatus]) {
            return;
        }
        if (this.statusPriority[msg1.OrdStatus].weight === this.statusPriority[msg2.OrdStatus].weight) {
            return;
        }
        return this.statusPriority[msg1.OrdStatus].weight > this.statusPriority[msg2.OrdStatus].weight ? msg1.OrdStatus : msg2.OrdStatus;
    }

}
