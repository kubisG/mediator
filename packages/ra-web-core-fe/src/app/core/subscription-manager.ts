import { Injectable } from "@angular/core";
import { SubscriptionManagerCollection } from "./subscription-manager-collection";

@Injectable({
    providedIn: "root"
})
export class SubscriptionManager {

    public collections: SubscriptionManagerCollection[] = [];

    public createCollection(type: any) {
        const collection = new SubscriptionManagerCollection(type.constructor.name);
        this.collections.push(collection);
        return collection;
    }

}
