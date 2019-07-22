import { AfterViewInit, Component, OnDestroy, ViewChild, ViewContainerRef } from "@angular/core";
import { ICellEditorAngularComp } from "ag-grid-angular";
import { extractValues } from "@ra/web-shared-fe/src/app/shared/utils";

@Component({
    selector: "ra-select-editor",
    templateUrl: "./select-editor.component.html",
    styleUrls: ["./select-editor.component.less"],
})
export class SelectEditorComponent implements ICellEditorAngularComp, OnDestroy, AfterViewInit {
    @ViewChild("container", { read: ViewContainerRef }) public container;

    public params: any;
    public selected;
    public values = [];

    constructor() {
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.container.element.nativeElement.focus();
        });
    }

    agInit(params: any) {
        this.params = params;
        this.values = params.values;
        const val = this.values.filter( x => x[params.valueExpr] === params.value );
        if (val) {
            this.selected = val[0];
        }
    }

    public getValue(): any {
        return this.selected ? this.selected[this.params.valueExpr] : null;
    }

    isPopup(): boolean {
        return false;
    }

    public ngOnDestroy() {
    }
}
