import { Injectable, Inject } from "@angular/core";
import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";
import { ReplaySubject } from "rxjs";
import { NotifyItem } from "@ra/web-components/src/app/notify/notify-item.interface";

@Injectable()
export class NotifyListService {

    public notifyItems: ReplaySubject<NotifyItem[]> = new ReplaySubject<NotifyItem[]>(1);
    public notifyItems$: Observable<NotifyItem[]> = this.notifyItems.asObservable();

    protected notifyItem: NotifyItem[] = [
    ];

    constructor(
    ) {
    }

    public pop(type, title, body) {
        this.notifyItem.unshift({ createDate: new Date(), type, title, body });
        this.notifyItem = this.notifyItem.slice(0, 20);
        this.notifyItems.next(this.notifyItem);
    }
}
