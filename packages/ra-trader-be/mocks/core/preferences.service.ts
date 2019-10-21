import { Substitute, Arg } from "@fluffy-spoon/substitute";
import { PreferencesService } from "@ra/web-core-be/dist/preferences.service";
import { testEnv } from "../environments/test-env";

export function getPreferenceService() {
    const preferenceService = Substitute.for<PreferencesService>();

    preferenceService.findPrefs(Arg.all()).returns(Promise.resolve({
        rows: testEnv.prefRows,
        theme: testEnv.prefTheme,
    }));

    return preferenceService;
}
