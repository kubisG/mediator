import { Dockable, DockableComponent, DockableHooks, QueryBuilderService } from "@ra/web-components";
import { MonitorTabComponent } from "../monitor-tab/monitor-tab.component";
import { Component, OnInit, ComponentFactoryResolver, Injector, ApplicationRef, Inject, Optional } from "@angular/core";
import { MonitorDataService } from "../monitor-data.service";
import { StoreListItem } from "../../monitor-core/stores-list/stores-list-item-interface";
import { GoldenLayoutComponentState } from "@embedded-enterprises/ng6-golden-layout";
import { Subscription } from "rxjs/internal/Subscription";
import { StoreQueryService } from "../store-query.service";
import { SubscriptionManager, SubscriptionManagerCollection } from "@ra/web-core-fe";
import { Operator } from "@ra/web-components";
import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";

@Dockable({
    tab: { component: MonitorTabComponent },
    header: { component: MonitorTabComponent },
    label: "Monitor Grid",
    icon: "dvr",
    params: {}
})
@Component({
    selector: "ra-monitor-grid",
    templateUrl: "./monitor-grid.component.html",
    styleUrls: ["./monitor-grid.component.less"],
    providers: [StoreQueryService],
})
export class MonitorGridComponent extends DockableComponent implements OnInit, DockableHooks {

    private subscriptions: SubscriptionManagerCollection;
    private page = 0;

    public updates: any[] = [];
    public snapshot: any[] = [];
    public columns: any[];
    public channelId: string;
    public subErrMsg: string;

    private clear: Subject<void> = new Subject<void>();
    public $clear: Observable<void> = this.clear.asObservable();

    public stores: any[];

    constructor(
        private storeQueryService: StoreQueryService,
        private monitorDataService: MonitorDataService,
        @Optional() @Inject(GoldenLayoutComponentState) protected componentState: any,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
        private subscriptionManager: SubscriptionManager,
    ) {
        super(
            componentFactoryResolver,
            injector,
            applicationRef,
        );
    }

    private okSubscribe() {
        this.subscriptions.add = this.monitorDataService.getSubscribeOkObservable(this.channelId).subscribe((data) => {
            if (data.snapshot) {
                this.snapshot = data.snapshot;
            }
            this.columns = data.columns;
        });
    }

    private okAllSubscribe() {
        this.subscriptions.add = this.monitorDataService.getInitOkObservable("all").subscribe((data) => {

        });
    }

    private updateSubscribe() {
        this.subscriptions.add = this.monitorDataService.getDataObservable(this.channelId).subscribe((data) => {
            console.log("private updateSubscribe", data);
            this.updates = data;
        });
    }

    private errSubscribe() {
        this.subscriptions.add = this.monitorDataService.getSubscribeErrObservable(this.channelId).subscribe((data) => {

        });
    }

    private getData() {
        this.channelId = this.monitorDataService.requestSubscribeData(
            this.storeQueryService.getQuery()
        );
        this.okSubscribe();
        this.okAllSubscribe();
        this.updateSubscribe();
        this.errSubscribe();
    }

    private changeData() {
        this.clear.next();
        this.monitorDataService.requestUnsubscribe(this.channelId);
        this.channelId = this.monitorDataService.requestSubscribeData(
            this.storeQueryService.getQuery(),
            this.page,
            this.channelId,
        );
        this.snapshot = [];
    }

    public storeChange(store: StoreListItem) {
        this.monitorDataService.requestUnsubscribe(this.channelId);
        this.monitorDataService.requestSubscribeData(`${store.prefix}`, 0, this.channelId);
    }

    public dockableClose(): Promise<void> {
        this.subscriptions.unsubscribe();
        this.monitorDataService.requestUnsubscribe(this.channelId);
        return Promise.resolve();
    }

    public onBackendFilter(operator: Operator) {
        this.storeQueryService.createQuery(operator);
        this.changeData();
    }

    public dockableShow() {

    }

    public dockableTab() {

    }

    public dockableHide() {

    }

    public ngOnInit(): void {
        this.subscriptions = this.subscriptionManager.createCollection(this);
        this.storeQueryService.setPrefix(this.componentState.prefix);
        this.getData();
        this.getTabResult().subscribe((data) => {

        });
        this.getHeaderResult().subscribe((data) => {

        });
        this.componentEmitter.subscribe((data) => {

        });
    }

}
