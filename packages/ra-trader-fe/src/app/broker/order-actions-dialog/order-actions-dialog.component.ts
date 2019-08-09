import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Inject, Component } from "@angular/core";

@Component({
    selector: "ra-broker-order-actions-dialog",
    templateUrl: "./order-actions-dialog.component.html",
    styleUrls: ["./order-actions-dialog.component.less"]
})
export class OrderActionsDialogComponent {

    public selectedOrder = {
        Placed: null,
        RaID: null,
        Symbol: null,
        OrderQty: null,
        Price: null
    };

    public type = 0;

    constructor(
        public dialogRef: MatDialogRef<OrderActionsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.selectedOrder = this.data.selectedOrder;
        this.type = this.data.type;
    }

    onNoClick() {
        this.dialogRef.close();
    }
}
