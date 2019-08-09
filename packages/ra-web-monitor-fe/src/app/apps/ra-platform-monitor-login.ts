import { FDC3ComponentService } from "@ra/web-components";
import { LoginComponent } from "../monitor-auth/login/login.component";
import { MonitorAuthService } from "../monitor-auth/monitor-auth.service";

export class RaPlatformMonitorLogin extends FDC3ComponentService {

    private opened = false;

    public component = LoginComponent;

    private async loadFromWorkSpace() {
        const workSpace = await this.fDC3Service.getSavedWorkSpace();
        if (workSpace) {
            try {
                const result = await this.fDC3Service.restoreWorkSpace(workSpace);
            } catch (ex) {
                console.log(ex);
            }
            return true;
        }
        return false;
    }

    private async setSuccessLoginCallBack() {
        const monitorAuthService = this.getInjection<MonitorAuthService>(MonitorAuthService);
        monitorAuthService.loginSuccess = async () => {
            this.fDC3Service.hide();
            if (!this.opened) {
                this.opened = true;
                if (await this.loadFromWorkSpace()) {
                    return;
                }
                const win = await this.fDC3Service.open(`ra.platform.monitor.app.launcher`, "Launcher", {});
            }
        };
    }

    public async start() {
        await this.setSuccessLoginCallBack();
    }

}
