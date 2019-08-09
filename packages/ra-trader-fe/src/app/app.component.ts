import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ToasterConfig } from "angular2-toaster";


@Component({
    selector: "ra-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.less"]
})
export class AppComponent implements OnInit {

    title = "ra-trader-fe";

    public toasterconfig: ToasterConfig =
        new ToasterConfig({
            showCloseButton: true,
            tapToDismiss: true,
            timeout: { error: 20000, info: 5000, warning: 10000 },
            limit: 6,
            positionClass: "toast-bottom-right"
        });

    constructor(private translate: TranslateService,
    ) {
        // add available langs
        this.translate.addLangs(["en"]);
        // this language will be used as a fallback when a translation isn't found in the current language
        this.translate.setDefaultLang("en");
        // set current language
        this.translate.use("en");
    }

    ngOnInit() {

    }
}
