import { State, Action, Store, StateContext, Selector } from "@ngxs/store";
import { PreferencesModel } from "./preferences.model";
import {
    LoadPreferences,
    ClearPreferences,
    SavePreferences,
    SavePreferencesSuccess,
    SavePreferencesError,
    EnableLogging
} from "./preferences.action";
import { RestPreferencesService } from "../../rest/rest-preferences.service";

@State<PreferencesModel>({
    name: "prefs",
    defaults: {
        showMeOnly: false,
        gtcGtd: false,
        rows: 10,
        rowColors: {},
        logging: false,
        theme: undefined,
        currency: {
            name: "$",
            value: "USD",
        }
    }
})
export class PreferencesState {

    constructor(
        private restPreferencesService: RestPreferencesService,
    ) { }

    @Selector()
    static getPrefs(state: PreferencesModel): PreferencesModel {
        return state;
    }

    @Action(EnableLogging)
    public enableLogging(ctx: StateContext<PreferencesModel>, action: EnableLogging) {
        const state = ctx.getState();
        ctx.patchState({ logging: !state.logging });
    }

    @Action(LoadPreferences)
    public loadPreferences(ctx: StateContext<PreferencesModel>, action: LoadPreferences) {
        return this.restPreferencesService.getPreferences().then((prefs) => {
            ctx.patchState(prefs.pref);
        });
    }

    @Action(ClearPreferences)
    public clearPreferences(ctx: StateContext<PreferencesModel>, action: ClearPreferences) {
        return ctx.setState({
            showMeOnly: false,
            gtcGtd: false,
            rows: 10,
            rowColors: {},
            logging: false,
            theme: undefined,
            currency: {
                name: "$",
                value: "USD",
            }
        });
    }

    @Action(SavePreferences)
    public savePreferences(ctx: StateContext<PreferencesModel>, action: SavePreferences) {
        return this.restPreferencesService.savePreferences({ pref: action.pref }).then(() => {
            ctx.setState(action.pref);
            ctx.dispatch(new SavePreferencesSuccess());
        }).catch((err) => {
            ctx.dispatch(new SavePreferencesError(err));
        });
    }

}
