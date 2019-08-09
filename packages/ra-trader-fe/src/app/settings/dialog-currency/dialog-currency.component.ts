
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { MoneyService } from "../../core/money/money.service";
import { RestPreferencesService } from "../../rest/rest-preferences.service";
import { NotifyService } from "../../core/notify/notify.service";

@Component({
  selector: "ra-dialog-currency",
  templateUrl: "dialog-currency.component.html",
  styleUrls: ["dialog-currency.component.less"]
})
export class DialogCurrencyComponent implements OnInit {

  public transfer: any;

  constructor(
    public dialogRef: MatDialogRef<DialogCurrencyComponent>,
    public moneyService: MoneyService,
    private restPreferencesService: RestPreferencesService,
    private toasterService: NotifyService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.moneyService.loadTransfers(this.data.currency).then(
      (curr) => {
        this.transfer = curr;
        for (let i = 0; i < this.data.lists["Currency"].length; i++) {
          if (!this.transfer[this.data.lists["Currency"][i].value]) {
            this.transfer[this.data.lists["Currency"][i].value] = 1;
          }
        }
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    if (this.data.actCurrency.value === this.data.currency.value) {
      this.moneyService.setTransfers(this.transfer);
    }

    this.restPreferencesService.saveUserPref(this.data.currency.value + "_transfers", this.transfer).then(
      (data) => { this.toasterService.pop("info", "Rates successfully saved"); }
    ).catch((error) => {
      this.toasterService.pop("error", "Database error", error.error.message);
    });
    this.dialogRef.close();
  }
}
