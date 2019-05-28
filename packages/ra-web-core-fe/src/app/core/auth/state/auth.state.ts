import { NgxsOnInit, StateContext, State, Store, Selector, Action } from "@ngxs/store";
import { AuthStateModel } from "../model/auth-state.model";
import { Login, Logout, AuthData, LoginSuccess, LogoutSuccess } from "../auth.actions";

@State<AuthStateModel>({
    name: "auth",
    defaults: {
        expiresIn: null,
        accessToken: null,
        payload: {}
    }
})
export class AuthState implements NgxsOnInit {

    constructor() { }

    @Selector()
    static getToken(state: AuthStateModel): string {
        return state.accessToken;
    }

    @Action(Login)
    public login(ctx: StateContext<AuthStateModel>, action: Login) {
        return action;
    }

    @Action(Logout)
    public logout(ctx: StateContext<AuthStateModel>, action: Logout) {
        ctx.setState({
            expiresIn: null,
            accessToken: null,
            payload: {}
        });
        ctx.dispatch(LogoutSuccess);
    }

    @Action(AuthData)
    public setAuthData(ctx: StateContext<AuthStateModel>, action: AuthData) {
        ctx.setState(action.data);
        ctx.dispatch(LoginSuccess);
    }

    public ngxsOnInit(ctx: StateContext<AuthStateModel>) {

    }

}
