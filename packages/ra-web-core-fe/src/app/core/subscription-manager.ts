import { Injectable } from "@angular/core";
import { SubscriptionManagerCollection } from "./subscription-manager-collection";

@Injectable({
    providedIn: "root"
})
export class SubscriptionManager {

    public collections: SubscriptionManagerCollection[] = [];

    public createCollection(type: any) {
        const collection = new SubscriptionManagerCollection(type.constructor.name, this);
        this.collections.push(collection);
        return collection;
    }

    public removeFromCollection(name: string) {
        for (let i = 0; i < this.collections.length; i++) {
            if (this.collections[i].name === name) {
                this.collections.splice(i, 1);
            }
        }
    }

}
