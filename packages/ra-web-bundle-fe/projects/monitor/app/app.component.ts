import { Component, OnInit, OnDestroy } from "@angular/core";
// import { MonitorAuthService } from "./monitor-auth/monitor-auth.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.less"]
})
export class AppComponent implements OnInit, OnDestroy {
    title = "ra-web-shared-fe";

    constructor(
        // private monitorAuthService: MonitorAuthService,
    ) { }

    public ngOnInit(): void {
        // this.monitorAuthService.subscribeToLoginAction();
        // this.monitorAuthService.subscribeToLoginSuccess();
        // this.monitorAuthService.subscribeToLoginFailed();
    }

    public ngOnDestroy() {
        // this.monitorAuthService.unsubscribe();
    }

}
