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
import { GridColumn } from "./interfaces/grid-column.interface";
import { SubscriptionManager, SubscriptionManagerCollection } from "@ra/web-core-fe";
@Component({
    selector: "ra-data-grid",
    templateUrl: "./data-grid.component.html",
    styleUrls: ["./data-grid.component.less"]
})
export class DataGridComponent implements OnInit, OnChanges, OnDestroy {

    private componentRef: ComponentRef<DataGridInterface>;
    private subscriptions: SubscriptionManagerCollection;

    private colors: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    private $colors: Observable<any[]> = this.colors.asObservable();

    private data: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    private $data: Observable<any[]> = this.data.asObservable();

    private updateData: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    private $updateData: Observable<any[]> = this.updateData.asObservable();

    private columnsData: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    private $columnsData: Observable<any[]> = this.columnsData.asObservable();

    private sumData: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    private $sumData: Observable<any[]> = this.sumData.asObservable();

    private rowActions: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    private $rowActions: Observable<any[]> = this.rowActions.asObservable();

    private gridEditable: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    private $gridEditable: Observable<any[]> = this.gridEditable.asObservable();

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

    @Input() set initSumColumns(columns: GridColumn[]) {
        console.log(columns);
        if (columns) {
            this.sumData.next(columns);
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
        private subscriptionManager: SubscriptionManager,
        private componentFactoryResolver: ComponentFactoryResolver,
        @Inject(DATA_GRID_COMPONENTS) private dataGridComponent: DataGridComponentsMap,
    ) {
        this.subscriptions = this.subscriptionManager.createCollection(this);
    }

    private subscribeData() {
        this.subscriptions.add = this.$data.subscribe((data) => {
            this.componentRef.instance.initData = data;
        });
        this.subscriptions.add = this.$updateData.subscribe((data) => {
            this.componentRef.instance.update = data;
        });
        this.subscriptions.add = this.$columnsData.subscribe((data) => {
            this.componentRef.instance.reset();
            this.componentRef.instance.initColumns = data;
        });
        this.subscriptions.add = this.$sumData.subscribe((data) => {
            this.componentRef.instance.reset();
            this.componentRef.instance.sumColumns = data;
        });

        this.subscriptions.add = this.$colors.subscribe((data) => {
            this.componentRef.instance.colors = data;
        });
        this.subscriptions.add = this.$rowActions.subscribe((data) => {
            this.componentRef.instance.rowActions = data;
        });
        this.subscriptions.add = this.$gridEditable.subscribe((data) => {
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

        this.subscriptions.add = this.componentRef.instance.initialized.subscribe((data) => {
            if (data) {
                this.initialized.emit(this);
            }
        });
        this.subscriptions.add = this.componentRef.instance.selected.subscribe((data) => {
            if (data) {
                this.selected.emit(data);
            }
        });
        this.subscriptions.add = this.componentRef.instance.rowSelected.subscribe((data) => {
            if (data) {
                this.rowSelected.emit(data);
            }
        });
        this.subscriptions.add = this.componentRef.instance.buttonClick.subscribe((data) => {
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

    public beginCustomLoading(info) {
        this.componentRef.instance.beginCustomLoading(info);
    }

    public endCustomLoading() {
        this.componentRef.instance.endCustomLoading();
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

    public saveEditData(): Promise<any> {
        return this.componentRef.instance.saveEditData();
    }

    public setSumData(data) {
        this.componentRef.instance.setSumData(data);
    }


    public filter(data) {
        this.componentRef.instance.setFilter(data);
    }

    public clearFilter() {
        this.componentRef.instance.setFilter();
    }

    public columnOption(id: number | string, optionName: string, optionValue: any) {
        this.componentRef.instance.setColOption(id, optionName, optionValue);
    }

    public setData(data: any[]) {
        this.componentRef.instance.setData(data);
    }

    public getData(): any[] {
        return this.componentRef.instance.getData();
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

    public addEmptyRow(id): any {
        return this.componentRef.instance.addEmptyRow(id);
    }

    public removeRow(data): any {
        return this.componentRef.instance.removeRow(data);
    }

    public getRowActions() {
        return this.rowActions;
    }

    public checkRows(data?) {
        this.componentRef.instance.checkRows(data);
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public ngOnInit() {
        this.loadComponent();
    }

    public ngOnChanges(changes: SimpleChanges): void {

    }
}
