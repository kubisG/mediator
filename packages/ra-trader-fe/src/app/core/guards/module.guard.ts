import { CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { environment } from "../../../environments/environment";
import { Modules } from "../../../module/module.enum";
import { Store } from "@ngxs/store";

export class ModuleGuard implements CanActivate {

    constructor() { }

    canActivate(route: ActivatedRouteSnapshot) {
        if (route.data.module === environment.app || environment.app === Modules.ALL) {
            return true;
        }
        return false;
    }
}
