import { Component, OnInit, OnDestroy, ComponentFactoryResolver, Injector, ApplicationRef } from "@angular/core";
import { NotifyService } from "../../core/notify/notify.service";
import { TranslateService } from "@ngx-translate/core";
import { AuthState } from "../../core/authentication/state/auth.state";
import { Store } from "@ngxs/store";
import { LoggerService } from "../../core/logger/logger.service";
import { RestCompaniesService } from "../../rest/rest-companies.service";
import { LayoutRights, Dockable, DockableComponent, DockableHooks } from "@ra/web-components";

@LayoutRights({
    roles: ["ADMIN", "MANAGER"]
})
@Dockable({
    label: "Company",
    icon: "list_alt",
})
@Component({
    selector: "ra-company-wide",
    templateUrl: "./company-wide.component.html",
    styleUrls: ["./company-wide.component.less"]
})
export class CompanyWideComponent extends DockableComponent implements OnInit, DockableHooks {
    private transSub;

    collapsed: boolean;
    private translations = {};
    public data;

    constructor(
        private restCompanyService: RestCompaniesService,
        private translate: TranslateService,
        private store: Store,
        private toasterService: NotifyService,
        private logger: LoggerService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
    }

    ngOnInit() {
        const user = this.store.selectSnapshot(AuthState.getUser);

        this.transSub = this.translate.get(["company.updated"])
            .subscribe((res) => this.translations = res);

        this.restCompanyService.getCompany(user.compId).then(
            (data) => {
                this.data = data;
            })
            .catch((error) => {
                this.data = {};
            });
    }

    dockableClose(): Promise<void> {
        if (this.transSub) {
            this.transSub.unsubscribe();
        }

        return Promise.resolve();
    }
    dockableShow() {
    }
    dockableTab() {
    }
    dockableHide() {
    }

    saveCompany() {
        this.restCompanyService.saveMyCompany(this.data).then(
            () => {
                this.toasterService.pop("info", this.translations["company.updated"]);
            })
            .catch((error) => {
                this.logger.error(error);
                this.toasterService.pop("error", "Database error", error.error.message);
            });
    }
}
