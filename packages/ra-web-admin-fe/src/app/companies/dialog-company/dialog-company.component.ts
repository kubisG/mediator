
import { Component, Inject, OnInit, Optional } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormControl, Validators } from "@angular/forms";

@Component({
  selector: "ra-dialog-company",
  templateUrl: "dialog-company.component.html",
  styleUrls: ["dialog-company.component.less"]
})
export class DialogCompanyComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
