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
    OnDestroy
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

    private data: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    private $data: Observable<any[]> = this.data.asObservable();

    private updateData: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    private $updateData: Observable<any[]> = this.updateData.asObservable();

    private columnsData: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    private $columnsData: Observable<any[]> = this.columnsData.asObservable();

    private dataSub: Subscription;
    private updateDataSub: Subscription;
    private columnsDataSub: Subscription;

    @ViewChild(AdDirective) raAdHost: AdDirective;

    @Input() set initData(data: any[]) {
        if (data.length > 0) {
            this.data.next(data);
        }
    }

    @Input() set update(data: any[]) {
        if (data.length > 0) {
            this.updateData.next(data);
        }
    }

    @Input() set initColumns(columns: GridColumn[]) {
        if (columns) {
            this.columnsData.next(columns);
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
    }

    public loadComponent() {
        const component = this.gridComponent ? this.dataGridComponent[this.gridComponent] : this.dataGridComponent.default;
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        const viewContainerRef = this.raAdHost.viewContainerRef;
        viewContainerRef.clear();
        this.componentRef = viewContainerRef.createComponent(componentFactory);
        this.componentRef.instance.gridKey = this.gridKey;
        this.subscribeData();
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
    }

    public ngOnInit() {
        this.loadComponent();
    }

    public ngOnChanges(changes: SimpleChanges): void {

    }
}
