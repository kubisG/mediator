
import { Component, Inject, OnInit, Optional } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { TraderAllocationsService } from "../allocations/trader-allocations.service";
import { OrderAllocated } from "@ra/web-shared-fe";
@Component({
    selector: "ra-allocation-dialog",
    templateUrl: "allocation-dialog.component.html",
    styleUrls: ["allocation-dialog.component.less"]
})
export class AllocationDialogComponent implements OnInit {

    public raId;
    public remainQty = 0;
    public sended = false;
    public orderAllocated = OrderAllocated;

    constructor(
        public dialogRef: MatDialogRef<AllocationDialogComponent>,
        private allocationsService: TraderAllocationsService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if ((data) && (data.data)) {
            this.raId = data.data.RaID;
            this.remainQty = this.data.data.CumQty;
        }
    }

    ngOnInit() {
    }

    showRemain(evt) {

        console.log(evt);
        this.remainQty = this.data.data.CumQty - evt;
    }

    onSend(type: string) {
        this.sended = true;
        this.allocationsService.sendMessage({ raID: this.raId, type: type });
        this.dialogRef.close(true);
    }

    onNoClick() {
        this.dialogRef.close();
    }
}
