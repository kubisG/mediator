import {
    Component,
    ViewChild,
    ComponentFactoryResolver,
    OnInit,
    Input,
    ComponentRef,
    OnChanges,
    SimpleChanges,
    Inject,
    OnDestroy,
    Output,
    EventEmitter
} from "@angular/core";
import { AdDirective } from "@ra/web-shared-fe";
import { DataGridInterface } from "./data-grid-interface";
import { DATA_GRID_COMPONENTS, DataGridComponentsMap } from "./data-grid-components-map.interface";
import { ReplaySubject } from "rxjs/internal/ReplaySubject";
import { Observable } from "rxjs/internal/Observable";
import { Subscription } from "rxjs/internal/Subscription";
import { GridColumn } from "./interfaces/grid-column.interface";
@Component({
    selector: "ra-data-grid",
    templateUrl: "./data-grid.component.html",
    styleUrls: ["./data-grid.component.less"]
})
export class DataGridComponent implements OnInit, OnChanges, OnDestroy {

    private componentRef: ComponentRef<DataGridInterface>;

    private colors: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    private $colors: Observable<any[]> = this.colors.asObservable();

    private data: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    private $data: Observable<any[]> = this.data.asObservable();

    private updateData: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    private $updateData: Observable<any[]> = this.updateData.asObservable();

    private columnsData: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    private $columnsData: Observable<any[]> = this.columnsData.asObservable();

    private rowActions: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    private $rowActions: Observable<any[]> = this.rowActions.asObservable();

    private gridEditable: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    private $gridEditable: Observable<any[]> = this.gridEditable.asObservable();

    private dataSub: Subscription;
    private updateDataSub: Subscription;
    private columnsDataSub: Subscription;
    private colorsSub: Subscription;
    private actionSub: Subscription;
    private editableSub: Subscription;    

    private initSub: Subscription;
    private selSub: Subscription;
    private rowSelSub: Subscription;
    private buttClickSub: Subscription;

    @ViewChild(AdDirective) raAdHost: AdDirective;

    @Output() initialized: EventEmitter<any> = new EventEmitter();
    @Output() selected: EventEmitter<any> = new EventEmitter();
    @Output() rowSelected: EventEmitter<any> = new EventEmitter();
    @Output() buttonClick: EventEmitter<any> = new EventEmitter();

    @Input() set initData(data: any[]) {
        if (data && data.length > 0) {
            this.data.next(data);
        }
    }

    @Input() set update(data: any[]) {
        if (data && data.length > 0) {
            this.updateData.next(data);
        }
    }

    @Input() set setColors(data: any[]) {
        if (data) {
            this.colors.next(data);
        }
    }

    @Input() set initColumns(columns: GridColumn[]) {
        console.log(columns);
        if (columns) {
            this.columnsData.next(columns);
        }
    }

    @Input() set actions(data: any[]) {
        if (data) {
            this.rowActions.next(data);
        }
    }

    @Input() set editable(data: any[]) {
        if (data) {
            this.gridEditable.next(data);
        }
    }


    @Input() gridComponent: string;
    @Input() gridKey = "id";

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        @Inject(DATA_GRID_COMPONENTS) private dataGridComponent: DataGridComponentsMap,
    ) { }

    private subscribeData() {
        this.dataSub = this.$data.subscribe((data) => {
            this.componentRef.instance.initData = data;
        });
        this.updateDataSub = this.$updateData.subscribe((data) => {
            this.componentRef.instance.update = data;
        });
        this.columnsDataSub = this.$columnsData.subscribe((data) => {
            this.componentRef.instance.reset();
            this.componentRef.instance.initColumns = data;
        });
        this.colorsSub = this.$colors.subscribe((data) => {
            this.componentRef.instance.colors = data;
        });
        this.actionSub = this.$rowActions.subscribe((data) => {
            this.componentRef.instance.rowActions = data;
        });
        this.editableSub = this.$gridEditable.subscribe((data) => {
            this.componentRef.instance.gridEditable = data;
        });
    }

    public loadComponent() {
        const component = this.gridComponent ? this.dataGridComponent[this.gridComponent] : this.dataGridComponent.default;
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        const viewContainerRef = this.raAdHost.viewContainerRef;
        viewContainerRef.clear();
        this.componentRef = viewContainerRef.createComponent(componentFactory);
        this.componentRef.instance.gridKey = this.gridKey;

        this.initSub = this.componentRef.instance.initialized.subscribe((data) => {
            if (data) {
                this.initialized.emit(this);
            }
        });
        this.selSub = this.componentRef.instance.selected.subscribe((data) => {
            if (data) {
                this.selected.emit(data);
            }
        });
        this.rowSelSub = this.componentRef.instance.rowSelected.subscribe((data) => {
            if (data) {
                this.rowSelected.emit(data);
            }
        });
        this.buttClickSub = this.componentRef.instance.buttonClick.subscribe((data) => {
            if (data) {
                this.buttonClick.emit(data);
            }
        });


        this.subscribeData();
    }

    public loadState(): any {
        return this.state();
    }

    public saveState(data): any {
        return this.state(data);
    }


    public state(data?): any {
        if (data) {
            return this.componentRef.instance.setState(data);
        } else {
            return this.componentRef.instance.getState();
        }
    }

    public pageSize(size) {
        console.log("TODO pagesize", size);
        return null;
    }

    public filter(data) {
        this.componentRef.instance.setFilter(data);
        console.log("TODO filter", data);
        return null;
    }

    public columnOption(id: number | string, optionName: string, optionValue: any) {
        this.componentRef.instance.setColOption(id, optionName, optionValue);
    }

    public setData(data: any[]) {
        this.componentRef.instance.setData(data);
    }

    public refresh(): Promise<any> {
        return Promise.resolve(this.componentRef.instance.refresh());
    }

    public insertRow(data: any) {
        this.updateData.next([data]);
    }

    public updateRow(data: any) {
        this.updateData.next([data]);
    }

    public getRowActions() {
        return this.rowActions;
    }

    public ngOnDestroy(): void {
        if (this.dataSub) {
            this.dataSub.unsubscribe();
        }
        if (this.updateDataSub) {
            this.updateDataSub.unsubscribe();
        }
        if (this.columnsDataSub) {
            this.columnsDataSub.unsubscribe();
        }
        if (this.colorsSub) {
            this.colorsSub.unsubscribe();
        }
        if (this.initSub) {
            this.initSub.unsubscribe();
        }
        if (this.selSub) {
            this.selSub.unsubscribe();
        }
        if (this.rowSelSub) {
            this.rowSelSub.unsubscribe();
        }
        if (this.buttClickSub) {
            this.buttClickSub.unsubscribe();
        }
        if (this.actionSub) {
            this.actionSub.unsubscribe();
        }
        if (this.editableSub) {
            this.editableSub.unsubscribe();
        }
    }

    public ngOnInit() {
        this.loadComponent();
    }

    public ngOnChanges(changes: SimpleChanges): void {

    }
}
