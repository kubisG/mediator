
import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";

import { Subscription } from "rxjs/internal/Subscription";
import { NotifyService } from "../../core/notify/notify.service";
import { ConfirmDialogComponent } from "@ra/web-shared-fe";


@Component({
    selector: "ra-cancel-dialog",
    templateUrl: "./cancel-dialog.component.html",
    styleUrls: ["./cancel-dialog.component.less"]
})
export class CancelDialogComponent implements OnInit, OnDestroy {

    public cancel = {
        sell: false,
        buy: false,
        sellShort: false,
        filtr: "personal",
        ClientID: null
    };
    private translations = {};
    private transSub: Subscription;

    constructor(
        public dialogRef: MatDialogRef<CancelDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private translate: TranslateService,
        private notifyService: NotifyService,
        public dialog: MatDialog,
    ) {
     }


    ngOnInit() {
        this.transSub = this.translate.get(["really.cancel"])
            .subscribe((res) => this.translations = res);
    }

    ngOnDestroy() {
        if (this.transSub) {
            this.transSub.unsubscribe();
        }
    }

    onChange(value) {
        this.cancel.filtr = value;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSaveClick(): void {
        this.notifyService.playSound("warning");
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: { text: this.translations["really.cancel"] }
        });
        const confSub = dialogRef.afterClosed().subscribe((result) => {
            confSub.unsubscribe();
            if (result) {
                this.dialogRef.close(this.cancel);
            } else {
                this.dialogRef.close();
            }
        });
    }

    changeOptions(evt) {
        this.cancel.sell = evt.checked;
        this.cancel.buy = evt.checked;
        this.cancel.sellShort = evt.checked;
    }
}
