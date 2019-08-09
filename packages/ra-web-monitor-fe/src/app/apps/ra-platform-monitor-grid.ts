import { FDC3ComponentService } from "@ra/web-components";
import { MonitorGridComponent } from "../monitor/monitor-grid/monitor-grid.component";
import { AuthData } from "@ra/web-core-fe";
import { MonitorAuthService } from "../monitor-auth/monitor-auth.service";

export class RaPlatformMonitorGrid extends FDC3ComponentService {

    public component = MonitorGridComponent;

    private setAuth() {
        const monitorAuthService = this.getInjection<MonitorAuthService>(MonitorAuthService);
        monitorAuthService.loginSuccess = async () => { };
        this.store.dispatch(new AuthData({
            accessToken: this.token,
            payload: {},
        }));
    }

    public async start() {
        this.setAuth();
    }

}
