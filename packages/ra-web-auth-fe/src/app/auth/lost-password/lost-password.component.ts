import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

import { FormControl, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";


@Component({
    selector: "ra-lost-password",
    templateUrl: "./lost-password.component.html",
    styleUrls: ["./lost-password.component.less"]
})
export class LostPasswordComponent implements OnInit {

    @Input() popupVisible;
    @Output() popupChange = new EventEmitter();
    private translations = {};

    public lostEmail: FormControl = new FormControl("", [Validators.required, Validators.email]);

    constructor(
        private translate: TranslateService,
    ) { }

    public ngOnInit() {
        this.translate.get(["lost.pass.mess.header", "lost.pass.mess.detail", "lost.pass.error"])
            .subscribe((res) => this.translations = res);
    }

    public popupHiding(event) {
        this.popupVisible = false;
        this.popupChange.emit(this.popupVisible);
    }

    public popupShowing(event) {
        this.lostEmail.setValue("");
    }

    public sendMail(event) {
        this.popupVisible = false;
        this.popupChange.emit(this.popupVisible);
    }
}
