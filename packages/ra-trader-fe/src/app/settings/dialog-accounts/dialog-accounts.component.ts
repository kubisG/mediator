
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { RestCounterPartyService } from "../../rest/rest-counter-party.service";
import { LoggerService } from "../../core/logger/logger.service";
import { AppType } from "@ra/web-shared-fe";
import { AuthState } from "../../core/authentication/state/auth.state";
import { Store } from "@ngxs/store";

@Component({
  selector: "ra-dialog-accounts",
  templateUrl: "dialog-accounts.component.html",
  styleUrls: ["dialog-accounts.component.less"]
})
export class DialogAccountsComponent implements OnInit {

  public allTypes = ["Y", "N"];
  public counterParties = [];
  public isBroker = false;

  constructor(
    public dialogRef: MatDialogRef<DialogAccountsComponent>,
    private counterPartyService: RestCounterPartyService,
    private logger: LoggerService,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    const app = this.store.selectSnapshot(AuthState.getApp);
    this.isBroker = ((app === AppType.Broker) || (app === AppType.Both));
  }

  ngOnInit() {
    this.counterPartyService.getRecords().then((records: any) => {
      this.counterParties = records;
    }).catch(error => { this.logger.error(error); });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
