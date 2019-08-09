import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { NgxsModule } from "@ngxs/store";
import { ToasterModule } from "angular2-toaster";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { NgxsStoragePluginModule, StorageOption } from "@ngxs/storage-plugin";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgProgressModule } from "@ngx-progressbar/core";
import { NgProgressHttpModule } from "@ngx-progressbar/http";
import { NgProgressRouterModule } from "@ngx-progressbar/router";
import { NgIdleModule } from "@ng-idle/core";
import { OverlayModule } from "@angular/cdk/overlay";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { environment } from "../environments/environment";
import { AuthState } from "./core/authentication/state/auth.state";
import { HeaderState } from "./header/state/header.state";
import { PreferencesState } from "./preferences/state/preferences.state";
import { CoreModule } from "./core/core.module";
import { PreferencesModule } from "./preferences/preferences.module";
import { RestModule } from "./rest/rest.module";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        ToasterModule.forRoot(),
        NgxsModule.forRoot([
            AuthState,
            HeaderState,
            PreferencesState,
        ]),
        NgxsStoragePluginModule.forRoot({
            key: ["auth", "prefs", "orderImport"],
            storage: StorageOption.SessionStorage,
        }),
        NgxsReduxDevtoolsPluginModule.forRoot({
            disabled: environment.production,
        }),
        NgxsLoggerPluginModule.forRoot({
            disabled: environment.production,
        }),

        AppRoutingModule,
        CoreModule,
        RestModule,
        PreferencesModule,
        HttpClientModule,
        OverlayModule,
        NgProgressModule.forRoot({ spinner: false }),
        NgProgressHttpModule.forRoot(),
        NgProgressRouterModule.forRoot(),
        NgIdleModule.forRoot(),
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
