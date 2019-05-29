import { StateStore } from "@embedded-enterprises/ng6-golden-layout";
import { RestUsersService } from "../rest/rest-users.service";

export class LayoutStateStorage implements StateStore {

    constructor(
        private restUsersService: RestUsersService,
    ) { }

    public writeState(state: any): void {
        this.restUsersService.setLayout(state);
    }

    public loadState(): Promise<any> {
        return this.restUsersService.getLayout().then((data) => {
            if (!data) {
                throw Error();
            }
            return data;
        });
    }

}
