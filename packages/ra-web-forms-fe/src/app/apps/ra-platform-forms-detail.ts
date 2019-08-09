import { FDC3ComponentService } from "@ra/web-components";
import { AuthData } from "@ra/web-core-fe";
import { HubFormsAuthService } from "../hub-forms-auth/hub-forms-auth.service";
import { HubFormsDetailComponent } from "../hub-forms/hub-forms-detail/hub-forms-detail.component";

export class RaPlatformFormsDetail extends FDC3ComponentService {

    public component = HubFormsDetailComponent;

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
