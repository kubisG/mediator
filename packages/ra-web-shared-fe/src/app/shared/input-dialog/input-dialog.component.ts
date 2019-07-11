import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormControl, Validators } from "@angular/forms";

@Component({
    selector: "ra-input-dialog",
    templateUrl: "./input-dialog.component.html",
    styleUrls: ["./input-dialog.component.less"]
})
export class InputDialogComponent {

    public layoutName: FormControl = new FormControl("", [Validators.required]);

    constructor(
        public dialogRef: MatDialogRef<InputDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }


    onNoClick(): void {
        this.dialogRef.close();
    }

    onOkClick(): void {
        this.dialogRef.close(this.layoutName.value);
    }
}
