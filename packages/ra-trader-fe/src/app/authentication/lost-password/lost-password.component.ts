import { Component, OnInit, Input, Inject, Output, EventEmitter } from "@angular/core";

import { FormControl, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { RestUsersService } from "../../rest/rest-users.service";
import { NotifyService } from "../../core/notify/notify.service";
import { LoggerService } from "../../core/logger/logger.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
    selector: "ra-lost-password",
    templateUrl: "./lost-password.component.html",
    styleUrls: ["./lost-password.component.less"]
})
export class LostPasswordComponent implements OnInit {

    private translations = {};

    public lostEmail: FormControl = new FormControl("", [Validators.required, Validators.email]);

    constructor(
        private toasterService: NotifyService,
        private usersService: RestUsersService,
        private translate: TranslateService,
        private logger: LoggerService,
        public dialogRef: MatDialogRef<LostPasswordComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    public ngOnInit() {
        this.translate.get(["lost.pass.mess.header", "lost.pass.mess.detail", "lost.pass.error"])
            .subscribe((res) => this.translations = res);
        this.lostEmail.setValue(this.data && this.data.email ? this.data.email : "");
    }

    public onNoClick() {
        this.dialogRef.close();
    }


    public sendMail(event) {
        this.usersService.saveMail(this.lostEmail.value).then(
            () => {
                this.toasterService.pop("info", this.translations["lost.pass.mess.header"]
                    , this.translations["lost.pass.mess.detail"] + this.lostEmail.value);
            })
            .catch((error) => {
                this.toasterService.pop("error", this.translations["lost.pass.error"], error.error.message);
                this.logger.error(error);
            });
            this.dialogRef.close();

    }
}
