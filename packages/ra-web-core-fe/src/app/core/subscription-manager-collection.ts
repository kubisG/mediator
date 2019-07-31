import { Subscription } from "rxjs/internal/Subscription";

export class SubscriptionManagerCollection {

    private subscriptions: Subscription[] = [];

    set add(subscription: Subscription) {
        this.subscriptions.push(subscription);
    }

    constructor(public name: string) { }

    public unsubscribe() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }

}
