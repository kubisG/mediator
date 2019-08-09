import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs/internal/Observable";
import { startWith } from "rxjs/internal/operators/startWith";
import { map } from "rxjs/operators";
import { ToasterService } from "angular2-toaster";

@Component({
    selector: "ra-dialog-forms-spec",
    templateUrl: "forms-spec-dialog.component.html",
    styleUrls: ["forms-spec-dialog.component.less"]
})
export class FormsSpecDialogComponent implements OnInit {

    public editorOptions = {
        theme: "vs-dark",
        language: "json",
        automaticLayout: true,
        minimap: {
            enabled: false
        }
    };
    public data;
    public companies: any[] = [];
    public inicialized = false;
    public monacoContent;

    private editor;

    constructor(
        public dialogRef: MatDialogRef<FormsSpecDialogComponent>,
        public toasterService: ToasterService,
        @Inject(MAT_DIALOG_DATA) public dialogData: any,
    ) {
        this.data = this.dialogData.data;
        if (this.dialogData.data.spec) {
            this.monacoContent = JSON.stringify(this.dialogData.data.spec, undefined, 4);
        }
        this.companies = this.dialogData.companies;
    }

    public onInit(event) {
        this.editor = event;
    }

    public ngOnInit(): void {
    }

    public onNoClick() {
        this.dialogRef.close();
    }

    public onOkClick() {
        if (
            this.data.company.id === "" ||
            this.data.name === "" ||
            !this.data.name
        ) {
            this.toasterService.pop("error", "Setting", "Missing attribute");
            return;
        }
        try {
            const pref = { ...this.data };
            pref.spec = JSON.parse(this.monacoContent);
            this.dialogRef.close(pref);
        } catch (ex) {
            this.toasterService.pop("error", "Setting", "Invalid JSON");
        }
    }

}
