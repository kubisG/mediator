import { AfterViewInit, Component, OnDestroy, ViewChild, ViewContainerRef } from "@angular/core";
import { ICellEditorAngularComp } from "ag-grid-angular";

@Component({
    selector: "ra-check-editor",
    templateUrl: "./check-editor.component.html",
    styleUrls: ["./check-editor.component.less"],
})
export class CheckEditorComponent implements ICellEditorAngularComp, OnDestroy, AfterViewInit {
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
        this.params = params;
        this.value = this.params.value;

        // only start edit if key pressed is a number, not a letter
        console.log("checker", params);
        this.cancelBeforeStart = params.charPress && ("1234567890".indexOf(params.charPress) < 0);
    }

    getValue(): any {
        return this.value;
    }

    isCancelBeforeStart(): boolean {
        return this.cancelBeforeStart;
    }

    isCancelAfterEnd(): boolean {
        return (this.params.min && this.value < this.params.min)
            || (this.params.max && this.value > this.params.max)
            || (this.params.required && !this.value)
            || (this.params.checker && !this.params.checker(this.value));
    }

    isPopup(): boolean {
        return false;
    }

    public ngOnDestroy() {
    }
}
