import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { MenuItem } from "@ra/web-components";
import { Observable } from "rxjs/internal/Observable";
import { RestUsersService } from "../rest/rest-users.service";
import { Store, Actions } from "@ngxs/store";
import { Router } from "@angular/router";
import { LogoutSuccess } from "@ra/web-core-fe";

@Injectable()
export class LayoutMenuItemsService {

    private menuItems: MenuItem[] = [
        {
            label: "Monitor",
            icon: "tv"
        },
        {
            label: "Logout",
            icon: "exit_to_app",
        }
    ];

    public headerMenuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.menuItems);
    public headerMenuItems$: Observable<MenuItem[]> = this.headerMenuItems.asObservable();

    constructor(
        private restUsersService: RestUsersService,
        private store: Store,
        private router: Router,
    ) { }

    private logout() {
        this.restUsersService.logout().then((data) => {
            this.store.dispatch(new LogoutSuccess(data));
            this.router.navigateByUrl(`/`);
        });
    }

    private monitor() {
        this.router.navigateByUrl(`/layout`);
    }

    public doMenuItemAction(item: MenuItem) {
        switch (item.label) {
            case "Logout": {
                this.logout();
                break;
            }
            case "Monitor": {
                this.monitor();
                break;
            }
        }
    }

}
