import {
    Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ComponentFactoryResolver,
    Injector, ApplicationRef
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs/internal/Subscription";
import { OrderStoreService } from "../order-store.service";
import { OrderTree } from "../order-tree.interface";
import { Dockable, DockableComponent, DockableHooks } from "@ra/web-components";
import { DataExchangeService } from "@ra/web-components";
import { MessageFactoryService } from "../message-factory.service";
import { MatDialog } from "@angular/material";
import { ConfirmDialogComponent, MessageType } from "@ra/web-shared-fe";

@Dockable({
    label: "Message Tree",
    icon: "sort",
    single: false
})
@Component({
    selector: "ra-order-tree",
    templateUrl: "./order-tree.component.html",
    styleUrls: ["./order-tree.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderTreeComponent extends DockableComponent implements OnInit, DockableHooks {

    public orderStoreService: OrderStoreService;
    public lists;
    public actions = [];

    set raId(raId) {
        this._raId = raId;
        this.setOrderTree();
    }

    get raId() {
        return this._raId;
    }

    public clickedItem;
    public orderTree: OrderTree;
    private _raId;
    private messagesSub: Subscription;

    constructor(
        private translate: TranslateService,
        public dialog: MatDialog,
        private messageFactoryService: MessageFactoryService,
        private changeDetectorRef: ChangeDetectorRef,
        public dataExchangeService: DataExchangeService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
    }

    actionClickEvent(e) {
        switch (e.action.label) {
            case "Cancel Fill": {
                this.orderStoreService.getOrderMessages(e.data.RaID).then((data) => {
                    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                        data: { text: "You really want to cancel fill?" }
                    });
                    dialogRef.afterClosed().subscribe((result) => {
                        const message = this.messageFactoryService.cancelFill(e.data, data[e.index - 1]);
                        (message as any).original = e.data;
                        this.orderStoreService.sendMessage(message);
                    });
                });
                break;
            }
            default: {
                break;
            }
        }
    }


    setSubscribe() {
        this.changeDetectorRef.markForCheck();
        if (this.messagesSub) {
            this.messagesSub.unsubscribe();
        }

        this.messagesSub = this.orderStoreService.getRoutingMessageType(MessageType.Execution).subscribe((execution) => {
            if (execution.RaID === this.raId) {
                this.setOrderTree();
            }
        });
    }

    ngOnInit() {
        const actData = this.dataExchangeService.getActData("ORDER");
        if (actData.key && (actData.data) && (actData.data !== null)) {
            if (actData.data.order.RaID) {
                this.orderStoreService = actData.data.orderStoreService;
                this.raId = actData.data.order.RaID;
                this.lists = actData.data.lists;
                this.actions = actData.data.treeActions;

                this.setSubscribe();
            }
        }

        this.dataSub = this.dataExchangeService.getData().subscribe((data) => {
            if ((data.key.indexOf("ORDER") > -1) && (this.isBind) && (data.data) && (data.data !== null)) {
                if ((data.data.order.RaID) && (data.data.order.RaID !== this.raId)) {
                    this.orderStoreService = data.data.orderStoreService;
                    this.raId = data.data.order.RaID;
                    this.lists = data.data.lists;
                    this.actions = data.data.treeActions;

                    this.setSubscribe();
                }
            }
        });

        this.clickSub = this.getHeaderResult().subscribe((data) => {
            this.isBind = data.isActive;
        });
    }

    dockableClose(): Promise<void> {
        if (this.messagesSub) {
            this.messagesSub.unsubscribe();
        }
        return Promise.resolve();
    }
    dockableShow() {
    }
    dockableTab() {
    }
    dockableHide() {
    }

    setOpened() {
    }

    checkOrderHighlight() {
        if (this.orderTree) {
            this.clickedItem = this.orderTree[0].item;
        }
    }

    setOrderTree() {
        this.orderStoreService.createMessageTree(this.raId).then((tree) => {
            this.orderTree = tree;
            this.checkOrderHighlight();
            this.changeDetectorRef.markForCheck();
        });
    }

    onDetailClick(item) {
        this.clickedItem = item;
    }
}
