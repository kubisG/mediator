import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Store } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { catchError } from "rxjs/operators";
import { throwError } from "rxjs/internal/observable/throwError";
import { EMPTY } from "rxjs/internal/observable/empty";
import { Observable } from "rxjs/internal/Observable";
import { AuthState } from "@ra/web-core-fe";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(
        private store: Store,
        private router: Router
    ) { }

    private handleAuthError(err: HttpErrorResponse): Observable<any> {
        if (err.status === 401 || err.status === 403) {
            this.router.navigateByUrl(`/`);
            return EMPTY;
        }
        return throwError(err);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.store.snapshot().auth.accessToken;
        const authReq = !!token ? req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
        }) : req;
        // return next.handle(authReq).catch(x => this.handleAuthError(x));
        return next.handle(authReq).pipe(catchError(x => this.handleAuthError(x)));
    }

}
