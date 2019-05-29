import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { MultiWindowInit } from "@embedded-enterprises/ng6-golden-layout";
import * as $ from "jquery";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

// It is required to have JQuery as global in the window object.
window["$"] = $;

if (environment.production) {
  enableProdMode();
}
MultiWindowInit();
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
