
import { Component, OnInit } from "@angular/core";

import { RestAccountsService } from "../../rest/rest-accounts.service";
import { MatDialogRef } from "@angular/material";


@Component({
    selector: "ra-dialog-acc",
    templateUrl: "dialog-acc.component.html",
    styleUrls: ["dialog-acc.component.less"],
})
export class DialogAccComponent implements OnInit {

    public accounts = [];
    public Account: string;

    constructor(
        public dialogRef: MatDialogRef<DialogAccComponent>,
        private restAccountsService: RestAccountsService) {
    }

    ngOnInit() {
        this.restAccountsService.getAccounts().then(
            (mydata) => { this.accounts = mydata; }
        );
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onOkClick() {
        this.dialogRef.close(this.Account);
    }
}
