import { Injectable } from "@angular/core";
import { StoreListItem } from "./stores-list-item-interface";
import { ReactiveList } from "@ra/web-core-fe";

@Injectable()
export class StoresListService extends ReactiveList<StoreListItem> { }
