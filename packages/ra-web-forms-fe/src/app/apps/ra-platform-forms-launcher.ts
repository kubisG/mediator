import { FDC3ComponentService, MenuItem } from "@ra/web-components";
import { AppLauncherComponent } from "./app-launcher/app-launcher.component";
import { AuthData } from "@ra/web-core-fe";
import { HubFormsAuthService } from "../hub-forms-auth/hub-forms-auth.service";

export class RaPlatformFormsLauncher extends FDC3ComponentService {

    public component = AppLauncherComponent;

    private subscribeToItemActions() {
        this.layoutService.itemAction$.subscribe((item: MenuItem) => {
            if (item.data && item.data.appId) {
                this.fDC3Service.sendNotification("id", "Opening ...", item.data.item.label);
                this.fDC3Service.open(item.data.appId, `${item.data.item.label}`, item.data.item);
            }
        });
    }

    private addContextListener() {

    }

    private setAuth() {
        const authService = this.getInjection<HubFormsAuthService>(HubFormsAuthService);
        authService.loginSuccess = async () => { };
        this.store.dispatch(new AuthData({
            accessToken: this.token,
            payload: {},
        }));
    }

    public async start() {
        this.setAuth();
        await this.fDC3Service.setAsRoot();
        this.subscribeToItemActions();
        this.addContextListener();
    }

}
