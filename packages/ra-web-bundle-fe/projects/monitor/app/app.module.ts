import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { JwtInterceptor } from "@ra/web-auth-fe";
import { HttpClient, HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AppRoutingModule } from "./app-routing.module";
import { SharedModule } from "@ra/web-shared-fe";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CoreModule, AuthState } from "@ra/web-core-fe";
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
        // TranslateModule.forRoot({
        //     loader: {
        //         provide: TranslateLoader,
        //         useFactory: HttpLoaderFactory,
        //         deps: [HttpClient],
        //     },
        // }),
        // NgxsModule.forRoot([
        //     AuthState,
        // ]),
        // NgxsStoragePluginModule.forRoot({
        //     key: ["auth", "prefs", "orderImport"],
        //     storage: StorageOption.SessionStorage,
        // }),
        // NgxsReduxDevtoolsPluginModule.forRoot({
        //     disabled: false,
        // }),
        // NgxsLoggerPluginModule.forRoot({
        //     disabled: false,
        // }),
        SharedModule,
        HttpClientModule,
        AppRoutingModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
