
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { RestCompaniesService } from "../../rest/rest-companies.service";


@Component({
    selector: "ra-dialog-user",
    templateUrl: "dialog-user.component.html",
    styleUrls: ["dialog-user.component.less"]
})
export class DialogUserComponent implements OnInit {

    public userClasses = ["ADMIN", "MANAGER", "USER", "READER"];

    public companies: any[] = [];

    constructor(
        public dialogRef: MatDialogRef<DialogUserComponent>,
        private companiesService: RestCompaniesService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
    }

    private initCompanies() {
        this.companiesService.getCompanies().then(
            (data) => {
                this.companies = data[0].sort((a, b) => a.companyName.localeCompare(b.companyName));
            })
            .catch((error) => {
                this.companies = [];
            });
    }

    public ngOnInit() {
        this.initCompanies();
    }

    public onNoClick(): void {
        this.dialogRef.close();
    }

    public onOkClick() {

        this.dialogRef.close(this.data);
    }
}
