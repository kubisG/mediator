import { AfterViewInit, Component, OnDestroy, ViewChild, ViewContainerRef } from "@angular/core";
import { ICellEditorAngularComp } from "ag-grid-angular";

@Component({
    selector: "ra-number-editor",
    templateUrl: "./number-editor.component.html",
    styleUrls: ["./number-editor.component.less"],
})
export class NumberEditorComponent implements ICellEditorAngularComp, OnDestroy, AfterViewInit {
    @ViewChild("input", { read: ViewContainerRef }) public input;

    public params: any;
    public value: number;
    private cancelBeforeStart = false;

    constructor() {
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.input.element.nativeElement.focus();
        });
    }

    agInit(params: any): void {
        console.log("checker", params);
        this.params = params;
        this.value = this.params.value;

        // only start edit if key pressed is a number, not a letter
        if (params.raType === "numeric") {
            this.cancelBeforeStart = params.charPress && ("1234567890".indexOf(params.charPress) < 0);
        }

    }

    getValue(): any {
        return this.value;
    }

    isCancelBeforeStart(): boolean {
        return this.cancelBeforeStart;
    }

    isCancelAfterEnd(): boolean {
        const result = ((this.params.raMin && this.value < this.params.raMin)
        || (this.params.raMax && this.value > this.params.raMax));

        if (result) {
            this.value = null;
        }

        // if (!result) {
        //     return false;
        // }
        // if (this.params.raValidators) {
        //     for (const validator of this.params.raValidators) {
        //         if (!(validator.valid(this.params))) {
        //             this.invalidMessage = validator.message;
        //             result = false;
        //             break;
        //         }
        //     }
        // }
        return result;
    }

    isPopup(): boolean {
        return false;
    }

    public ngOnDestroy() {
    }
}
