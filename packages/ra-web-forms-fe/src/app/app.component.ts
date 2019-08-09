import { Component, OnInit, OnDestroy } from "@angular/core";
import { HubFormsAuthService } from "./hub-forms-auth/hub-forms-auth.service";
import { ToasterConfig } from "angular2-toaster";
import { SystemChannelService } from "./system-channel/system-channel.service";

@Component({
    selector: "ra-app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.less"]
})
export class AppComponent implements OnInit, OnDestroy {
    title = "ra-web-forms-fe";

    public toasterconfig: ToasterConfig =
        new ToasterConfig({
            showCloseButton: true,
            tapToDismiss: true,
            timeout: { error: 20000, info: 5000, warning: 10000 },
            limit: 6,
            positionClass: "toast-bottom-right"
        });

    constructor(
        private authService: HubFormsAuthService,
        private systemsService: SystemChannelService,
    ) { }

    public ngOnInit(): void {
        this.authService.subscribeToLoginAction();
        this.authService.subscribeToLoginSuccess();
        this.authService.subscribeToLoginFailed();
    }

    public ngOnDestroy() {
        this.authService.unsubscribe();
    }

}
