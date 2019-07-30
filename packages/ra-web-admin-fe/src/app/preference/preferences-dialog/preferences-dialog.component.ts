import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs/internal/Observable";
import { startWith } from "rxjs/internal/operators/startWith";
import { map } from "rxjs/operators";

@Component({
    selector: "ra-dialog-preferences",
    templateUrl: "preferences-dialog.component.html",
    styleUrls: ["preferences-dialog.component.less"]
})
export class PreferencesDialogComponent implements OnInit {

    public editorOptions = {
        language: "json",
        automaticLayout: true,
        theme: "vs-dark",
        minimap: {
            enabled: false
        }
    };
    public data;
    public users: any[] = [];
    public companies: any[] = [];
    public userControl = new FormControl("", [Validators.required]);
    public companyControl = new FormControl("", [Validators.required]);
    public filteredUserOptions: Observable<any[]>;
    public filteredCompanyOptions: Observable<any[]>;

    private editor;

    constructor(
        public dialogRef: MatDialogRef<PreferencesDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public dialogData: any,
    ) {
        this.data = this.dialogData.data;
        console.log("data,", this.data);
        this.users = this.dialogData.users;
        this.companies = this.dialogData.companies;
    }

    private setControls() {
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].id === this.data.userId) {
                this.userControl.setValue(this.users[i]);
            }
        }
        for (let i = 0; i < this.companies.length; i++) {
            if (this.companies[i].id === this.data.companyId) {
                this.companyControl.setValue(this.companies[i]);
            }
        }
    }

    private _filterUser(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.users.filter(option => option.email.toLowerCase().indexOf(filterValue) === 0);
    }

    private _filterCompany(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.companies.filter(option => option.companyName.toLowerCase().indexOf(filterValue) === 0);
    }

    public displayUserFn(user?: any): string | undefined {
        return user ? user.email : undefined;
    }

    public displayCompanyFn(company?: any): string | undefined {
        return company ? company.companyName : undefined;
    }

    public onInit(event) {
        this.editor = event;
    }

    public ngOnInit(): void {
        this.filteredUserOptions = this.userControl.valueChanges
            .pipe(
                startWith<string | any>(""),
                map(value => typeof value === "string" ? value : value.email),
                map(name => name ? this._filterUser(name) : this.users.slice())
            );
        this.filteredCompanyOptions = this.companyControl.valueChanges
            .pipe(
                startWith<string | any>(""),
                map(value => typeof value === "string" ? value : value.companyName),
                map(name => name ? this._filterCompany(name) : this.companies.slice())
            );
        this.setControls();
    }

    public onNoClick() {
        this.dialogRef.close();
    }

    public onOkClick() {
        if (
            this.userControl.value === "" ||
            this.companyControl.value === "" ||
            this.data.name === "" ||
            !this.data.name
        ) {
            alert("Missing attribute");
            return;
        }
        try {
            const pref = { ...this.data };
            JSON.parse(pref.value);
            pref.newUserId = this.userControl.value.id;
            pref.newCompanyId = this.companyControl.value.id;
            this.dialogRef.close(pref);
        } catch (ex) {
            alert("Invalid JSON");
        }
    }

}
