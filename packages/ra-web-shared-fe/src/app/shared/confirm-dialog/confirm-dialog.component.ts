
import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
    selector: "ra-confirm-dialog",
    templateUrl: "./confirm-dialog.component.html",
    styleUrls: ["./confirm-dialog.component.less"]
})
export class ConfirmDialogComponent implements OnInit, OnDestroy {

    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }


    ngOnInit() {
    }

    ngOnDestroy() {
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    onOkClick(): void {
        this.dialogRef.close(true);
    }

}
