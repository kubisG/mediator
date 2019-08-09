import { SettingsComponent } from "./settings/settings.component";
import { CompanyWideComponent } from "./company-wide/company-wide.component";
import { CounterPartyComponent } from "./counter-party/counter-party.component";
import { SoundsComponent } from "./sounds/sounds.component";
import { AccountsComponent } from "./accounts/accounts.component";
import { PasswordChangeComponent } from "./password-change/password-change.component";

export const settingsComponentList = [
    {
        component: SettingsComponent,
        componentName: "ra-settings"
    },
    {
        component: CompanyWideComponent,
        componentName: "ra-company-wide"
    },
    {
        component: CounterPartyComponent,
        componentName: "ra-counter-party"
    },
    {
        component: SoundsComponent,
        componentName: "ra-sounds"
    },
    {
        component: AccountsComponent,
        componentName: "ra-accounts"
    },
    {
        component: PasswordChangeComponent,
        componentName: "ra-password-change"
    },
];
