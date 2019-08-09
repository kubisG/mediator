import { UsersComponent } from "../users/users.component";
import { CompaniesComponent } from "../companies/companies.component";
import { InputRulesComponent } from "../input-rules/input-rules.component";
import { PreferencesComponent } from "../preferences/preferences.component";

export const adminComponentList = [
    {
        component: UsersComponent,
        componentName: "ra-users"
    },
    {
        component: CompaniesComponent,
        componentName: "ra-companies"
    },
    {
        component: InputRulesComponent,
        componentName: "ra-input-rules"
    },
    {
        component: PreferencesComponent,
        componentName: "ra-preferences"
    },
];
