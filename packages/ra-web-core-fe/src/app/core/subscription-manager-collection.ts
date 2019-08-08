import { Subscription } from "rxjs/internal/Subscription";
import { SubscriptionManager } from "./subscription-manager";

export class SubscriptionManagerCollection {

    private subscriptions: Subscription[] = [];

    set add(subscription: Subscription) {
        this.subscriptions.push(subscription);
    }

    constructor(public name: string, private subscriptionManager: SubscriptionManager) { }

    public unsubscribe() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
        this.subscriptionManager.removeFromCollection(this.name);
    }

}
