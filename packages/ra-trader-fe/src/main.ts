import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { MultiWindowInit } from "@embedded-enterprises/ng6-golden-layout";
import * as $ from "jquery";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";
// import { setup, track, printSubscribers } from "observable-profiler";
// require("default-passive-events");

// It is required to have JQuery as global in the window object.
window["$"] = $;

$.event.special.touchstart = {
    setup: function (_, ns, handle) {
        this.addEventListener("touchstart", handle as any, { passive: true });
    }
 };


if (environment.production) {
    enableProdMode();
}
MultiWindowInit();
platformBrowserDynamic().bootstrapModule(AppModule).then(ref => { })
    .catch(err => console.error(err));

// setup(Observable);
// platformBrowserDynamic([])
//   .bootstrapModule(AppModule)
//   .then(ref => {
//     track();
//     (window as any).stopProfiler = () => {
// //      ref.destroy();
//       const subscribers = track(false);
//       console.log(subscribers);
//       // printSubscribers({
//       //   subscribers,
//       // });
//     };
//   });
