import { FDC3ComponentService } from "@ra/web-components";
import { AuthData } from "@ra/web-core-fe";
import { HubFormsAuthService } from "../hub-forms-auth/hub-forms-auth.service";
import { HubFormsGridComponent } from "../hub-forms/hub-forms-grid/hub-forms-grid.component";

export class RaPlatformFormsGrid extends FDC3ComponentService {

    public component = HubFormsGridComponent;

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
    }

}
