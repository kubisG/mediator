import { NgxsOnInit, StateContext, State, Store, Selector } from "@ngxs/store";
import { AuthStateModel } from "../model/auth-state.model";

@State<AuthStateModel>({
    name: "auth",
    defaults: {
        expiresIn: null,
        accessToken: null,
        payload: {}
    }
})
export class AuthState implements NgxsOnInit {

    constructor(
        private store: Store,
    ) { }

    @Selector()
    static getToken(state: AuthStateModel): string {
        return state.accessToken;
    }

    ngxsOnInit(ctx: StateContext<AuthStateModel>) {

    }

}
