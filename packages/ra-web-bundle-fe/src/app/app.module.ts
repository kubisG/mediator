import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { NgxsModule, Actions, Store, ofActionDispatched } from "@ngxs/store";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { NgxsStoragePluginModule, StorageOption } from "@ngxs/storage-plugin";
import { JwtInterceptor } from "@ra/web-auth-fe";
import { SharedModule } from "@ra/web-shared-fe";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CoreModule, AuthState } from "@ra/web-core-fe";
import { MonitorAuthModule } from "./monitor-auth/monitor-auth.module";
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
        NgxsModule.forRoot([
            AuthState,
        ]),
        NgxsStoragePluginModule.forRoot({
            key: ["auth"],
            storage: StorageOption.SessionStorage,
        }),
        NgxsReduxDevtoolsPluginModule.forRoot({
            disabled: false,
        }),
        NgxsLoggerPluginModule.forRoot({
            disabled: false,
        }),
        SharedModule,
        HttpClientModule,
        AppRoutingModule,
        MonitorAuthModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
