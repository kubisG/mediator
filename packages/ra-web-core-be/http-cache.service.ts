import { Injectable, Inject } from "@nestjs/common";
import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";


@Injectable()
export class HttpCacheService {

    public clearCache: Subject<any> = new Subject<any>();
    public clearCache$: Observable<any> = this.clearCache.asObservable();

    constructor(
    ) { }

    public setClearCache(companyId?) {
        this.clearCache.next(companyId);
    }

    public getClearCache(): Observable<any> {
        return this.clearCache$;
    }

}
