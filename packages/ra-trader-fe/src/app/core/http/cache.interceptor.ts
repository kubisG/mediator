import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler } from "@angular/common/http";
import { of } from "rxjs";
import { tap } from "rxjs/operators";
import { CacheMapService } from "../cache/cache-map.service";

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
    constructor(private cache: CacheMapService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRequestCachable(req)) {
            return next.handle(req);
        }
        const cachedResponse = this.cache.get(req);
        if (cachedResponse !== null) {
            return of(cachedResponse);
        }
        return next.handle(req).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    this.cache.put(req, event);
                }
            })
        );
    }
    private isRequestCachable(req: HttpRequest<any>) {
        if (req.headers.has("X-enable-cache")) {
            const headers = req.headers.delete("X-enable-cache");
            const directRequest = req.clone({ headers });
            req = directRequest;
            return true;
        }
        return false;
    }
}
