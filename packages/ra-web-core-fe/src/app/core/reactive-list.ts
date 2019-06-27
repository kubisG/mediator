import { ReplaySubject } from "rxjs/internal/ReplaySubject";
import { Observable } from "rxjs/internal/Observable";

export class ReactiveList<T> {

    public list: T[] = [];

    protected subject: ReplaySubject<T[]> = new ReplaySubject<T[]>();
    public observable: Observable<T[]> = this.subject.asObservable();

    constructor() {
        this.init();
    }

    protected init() { }

    public addItem(item: T, prepend = false) {
        if (prepend) {
            this.list.unshift(item);
        } else {
            this.list.push(item);
        }
        this.subject.next(this.list);
    }

    public addItems(items: T[], prepend = false) {
        if (prepend) {
            this.list = [
                ...items,
                ...this.list,
            ];
            return;
        } else {
            this.list = [
                ...this.list,
                ...items,
            ];
        }
        this.subject.next(this.list);
    }

    public push() {
        this.subject.next(this.list);
    }

}
