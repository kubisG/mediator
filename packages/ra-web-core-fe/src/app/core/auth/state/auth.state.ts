import { NgxsOnInit, StateContext, State, Store, Selector, Action } from "@ngxs/store";
import { AuthStateModel } from "../model/auth-state.model";
import { Login, LoginSuccess, LoginFailed, Logout, LogoutSuccess } from '../auth.actions';
import { Injector, ApplicationRef } from "@angular/core";
import { AuthService } from '../auth.service';

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
        private authService: AuthService,
    ) { }

    @Selector()
    static getToken(state: AuthStateModel): string {
        return state.accessToken;
    }

    @Action(Login)
    public login(ctx: StateContext<AuthStateModel>, action: Login) {
        console.log(this.authService);
        // return this.authService.login(action.email, action.password).then(
        //     (data) => {
        //         ctx.setState(data);
        //         ctx.dispatch(new LoginSuccess(data));
        //     })
        //     .catch((error) => {
        //         ctx.dispatch(new LoginFailed(error));
        //     });
    }

    @Action(Logout)
    public logout(ctx: StateContext<AuthStateModel>, action: Logout) {
        // const logoutCallBack = (data) => {
        //     ctx.setState({
        //         expiresIn: null,
        //         accessToken: null,
        //         payload: {}
        //     });
        //     ctx.dispatch(new LogoutSuccess(data));
        // };
        // return this.authService.logout().then(logoutCallBack).catch(logoutCallBack);
    }

    ngxsOnInit(ctx: StateContext<AuthStateModel>) {

    }

}
