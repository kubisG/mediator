import { Routes } from "@angular/router";
import { LoginFormComponent } from "./login-form/login-form.component";

export const authenticationRoutes: Routes = [
    { path: "login", component: LoginFormComponent },
];
