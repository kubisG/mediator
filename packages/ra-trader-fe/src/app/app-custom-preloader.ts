import { PreloadingStrategy, Route } from "@angular/router";
import { Observable } from "rxjs/internal/Observable";
import { of } from "rxjs/internal/observable/of";

export class AppCustomPreloader implements PreloadingStrategy {
    preload(route: Route, fn: () => Observable<any>): Observable<any> {
        return route.data && route.data.preload ? fn() : of(null);
    }
}
