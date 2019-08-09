import { PreferencesModel } from "./preferences.model";
import { AuthStateModel } from "../../core/authentication/state/auth.model";

export class LoadPreferences {
    static readonly type = "[Prefs] load";
    constructor() { }
}

export class ClearPreferences {
    static readonly type = "[Prefs] clear";
}

export class SavePreferences {
    static readonly type = "[Prefs] save";
    constructor(
        public pref: PreferencesModel
    ) { }
}

export class EnableLogging {
    static readonly type = "[Prefs] enable logging";
}

// Events
export class SavePreferencesSuccess {
    static readonly type = "[Prefs] save success";
    constructor() { }
}

export class SavePreferencesError {
    static readonly type = "[Prefs] save error";
    constructor(public error: any) { }
}
