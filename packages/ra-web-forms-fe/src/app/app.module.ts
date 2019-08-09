import { BrowserModule } from "@angular/platform-browser";
import { NgModule, ModuleWithProviders } from "@angular/core";
import { AppComponent } from "./app.component";
import { NgxsModule, Actions, Store, ofActionDispatched } from "@ngxs/store";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { NgxsStoragePluginModule, StorageOption } from "@ngxs/storage-plugin";
import { NgProgressModule } from "@ngx-progressbar/core";
import { NgProgressHttpModule } from "@ngx-progressbar/http";
import { NgProgressRouterModule } from "@ngx-progressbar/router";
import { JwtInterceptor } from "@ra/web-auth-fe";
import { SharedModule, EnvironmentInterface, ENVIRONMENT } from "@ra/web-shared-fe";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToasterModule } from "angular2-toaster";
import { CoreModule, AuthState } from "@ra/web-core-fe";
import { HubFormsAuthModule } from "./hub-forms-auth/hub-forms-auth.module";
import { FormsRestModule } from "./rest/forms-rest.module";
import { SystemChannelModule } from "./system-channel/system-channel.module";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        CoreModule,
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
        ]),
        NgxsStoragePluginModule.forRoot({
            key: ["auth", "prefs"],
            storage: StorageOption.SessionStorage,
        }),
        NgxsReduxDevtoolsPluginModule.forRoot({
            disabled: false,
        }),
        NgxsLoggerPluginModule.forRoot({
            disabled: false,
        }),
        NgProgressModule.forRoot({ spinner: false }),
        NgProgressHttpModule.forRoot(),
        NgProgressRouterModule.forRoot(),
        SharedModule,
        HttpClientModule,
        AppRoutingModule,
        HubFormsAuthModule,
        SystemChannelModule,
        FormsRestModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
