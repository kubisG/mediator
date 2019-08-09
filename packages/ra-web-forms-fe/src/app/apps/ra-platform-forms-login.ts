import { FDC3ComponentService } from "@ra/web-components";
import { LoginComponent } from "../hub-forms-auth/login/login.component";
import { HubFormsAuthService } from "../hub-forms-auth/hub-forms-auth.service";

export class RaPlatformFormsLogin extends FDC3ComponentService {

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
        const authService = this.getInjection<HubFormsAuthService>(HubFormsAuthService);
        authService.loginSuccess = async () => {
            this.fDC3Service.hide();
            if (!this.opened) {
                this.opened = true;
                if (await this.loadFromWorkSpace()) {
                    return;
                }
                const win = await this.fDC3Service.open(`ra.platform.forms.app.launcher`, "Launcher", {});
            }
        };
    }

    public async start() {
        await this.setSuccessLoginCallBack();
    }

}
