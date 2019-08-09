import { State, NgxsOnInit, Store, Selector, StateContext, Action } from "@ngxs/store";
import { AuthStateModel } from "./auth.model";
import { AuthService } from "../auth.service";
import { SetPrefs, Login, LoginSuccess, LoginFailed, Logout, LogoutSuccess } from "./auth.actions";
import { LoadPreferences, ClearPreferences } from "../../../preferences/state/preferences.action";

@State<AuthStateModel>({
    name: "auth",
    defaults: {
        token: null,
        username: null,
        role: "USER",
        rows: 10,
        theme: "",
        id: null,
        firstName: "",
        lastName: "",
        companyName: "",
        nickName: "",
        compId: null,
        compQueue: "",
        compQueueTrader: "",
        compQueueBroker: "",
        app: 0,
        appPrefs: null,
        ClientID: null,
    }
})
export class AuthState implements NgxsOnInit {

    constructor(
        private authService: AuthService,
        private store: Store,
    ) { }

    @Selector()
    static getToken(state: AuthStateModel): string {
        return state.token;
    }

    @Selector()
    static getUserName(state: AuthStateModel): string {
        return state.username;
    }

    @Selector()
    static getRole(state: AuthStateModel): string {
        return state.role;
    }

    @Selector()
    static getRows(state: AuthStateModel): number {
        return state.rows;
    }

    @Selector()
    static getTheme(state: AuthStateModel): string {
        return state.theme;
    }

    @Selector()
    static getUserId(state: AuthStateModel): number {
        return state.id;
    }

    @Selector()
    static getApp(state: AuthStateModel): number {
        return state.app;
    }

    @Selector()
    static getUser(state: AuthStateModel): AuthStateModel {
        return { ...state };
    }

    @Selector()
    static getAppPrefs(state: AuthStateModel): any {
        return state.appPrefs;
    }

    public ngxsOnInit(ctx: StateContext<AuthStateModel>) {

    }

    @Action(Login)
    public login(ctx: StateContext<AuthStateModel>, action: Login) {
        return this.authService.login(action.email, action.password).then(
            (data) => {
                ctx.setState({
                    username: action.email,
                    token: data.accessToken,
                    role: data.role,
                    rows: data.rows,
                    theme: data.theme,
                    id: data.id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    nickName: data.nickName,
                    companyName: data.companyName,
                    compId: data.compId,
                    compQueue: data.compQueue,
                    compQueueTrader: data.compQueueTrader,
                    compQueueBroker: data.compQueueBroker,
                    app: data.app,
                    appPrefs: data.appPrefs,
                    ClientID: data.ClientID,
                });
                this.store.dispatch(new LoadPreferences()).toPromise().then((a) => {
                    ctx.dispatch(new LoginSuccess(data));
                }).catch((err) => {
                    ctx.dispatch(new LoginFailed(err));
                });
            })
            .catch((error) => {
                ctx.dispatch(new LoginFailed(error));
            });
    }

    @Action(Logout)
    public logout(ctx: StateContext<AuthStateModel>, action: Logout) {

        const logoutCallBack = (data) => {
            ctx.setState({
                token: null,
                username: null,
                role: "USER",
                rows: 10,
                theme: "",
                id: null,
                firstName: "",
                lastName: "",
                companyName: "",
                nickName: "",
                compId: null,
                compQueue: "",
                compQueueTrader: "",
                compQueueBroker: "",
                app: 0,
                appPrefs: null,
                ClientID: null,
            });
            this.store.dispatch(new ClearPreferences()).toPromise().then(() => {
                ctx.dispatch(new LogoutSuccess(data));
            }).catch((err) => {
                ctx.dispatch(new LogoutSuccess(data));
            });
        };

        return this.authService.logout().then(logoutCallBack).catch(logoutCallBack);
    }

    @Action(SetPrefs)
    public setPrefs(ctx: StateContext<AuthStateModel>, action: SetPrefs) {
        ctx.patchState({ rows: action.rows });
    }

}
