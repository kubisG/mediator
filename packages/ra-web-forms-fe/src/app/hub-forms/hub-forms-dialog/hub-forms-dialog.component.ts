import { Component, Inject, ChangeDetectorRef, DoCheck, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormlyFormOptions, FormlyFieldConfig } from "@ngx-formly/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
    selector: "ra-hub-forms-dialog",
    templateUrl: "./hub-forms-dialog.component.html",
    styleUrls: ["./hub-forms-dialog.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class HubFormsDialogComponent implements OnInit, DoCheck {

    public value;
    form = new FormGroup({});
    model: any = {};
    options: FormlyFormOptions = {
        formState: {
            mainModel: this.model,
        },
    };
    fields: FormlyFieldConfig[] = [];
    public showJson = false;

    public editorOptions = {
        theme: "vs-dark",
        language: "json",
        automaticLayout: true,
        minimap: {
            enabled: false
        }
    };
    public monacoContent;

    private editor;

    public onInit(event) {
        this.editor = event;
    }


    constructor(
        public dialogRef: MatDialogRef<HubFormsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private cdrf: ChangeDetectorRef,
    ) {
        this.fields = data.fields;
        if (data.type === "U") {
            this.model = data.model;
        } else {
            this.model = {};
        }
    }

    public sendData() {
        this.dialogRef.close(this.model);
    }

    ngDoCheck(): void {
        this.cdrf.detectChanges();
    }

    ngOnInit() {
    }

    onNoClick() {
        this.dialogRef.close();
    }

    showJSON() {
        this.showJson = !this.showJson;
        if (this.showJson) {
            this.monacoContent = JSON.stringify(this.model, undefined, 4);
        }

    }

}
