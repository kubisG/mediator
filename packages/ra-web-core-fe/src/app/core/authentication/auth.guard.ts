import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot } from "@angular/router";
import { Store } from "@ngxs/store";
import { AuthState } from "./state/auth.state";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private store: Store, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot) {
        const roles = route.data.roles as string[];
        const token = this.store.selectSnapshot(AuthState.getToken);
        const role = this.store.selectSnapshot(AuthState.getRole);
        // check token and role
        if ((token === null) || (roles.indexOf(role) === -1)) {
            this.router.navigate(["/"]);
        }
        return token !== null;
    }

}
