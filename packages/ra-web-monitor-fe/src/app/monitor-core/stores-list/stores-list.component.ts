import { Component, OnInit, Input, ChangeDetectionStrategy, EventEmitter, Output } from "@angular/core";
import { StoresListService } from "./stores-list.service";
import { Observable } from "rxjs/internal/Observable";
import { StoreListItem } from "./stores-list-item-interface";

@Component({
    selector: "ra-stores-list",
    templateUrl: "./stores-list.component.html",
    styleUrls: ["./stores-list.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoresListComponent implements OnInit {

    @Input() selected: StoreListItem;
    @Output() storeChange: EventEmitter<StoreListItem> = new EventEmitter<StoreListItem>();

    stores: Observable<StoreListItem[]>;

    constructor(
        private storesListService: StoresListService,
    ) { }

    compareWith(option: StoreListItem, selected: StoreListItem) {
        if (option.prefix === selected.prefix) {
            return true;
        }
        return false;
    }

    selectionChange($event) {
        this.storeChange.emit($event.value);
    }

    ngOnInit(): void {
        this.stores = this.storesListService.observable;
    }

}
