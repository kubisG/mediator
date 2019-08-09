import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { DataExchangeService } from "@ra/web-components";

@Component({
    selector: "ra-order-tree-view",
    templateUrl: "./order-tree-view.component.html",
    styleUrls: ["./order-tree-view.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderTreeViewComponent implements OnInit {

    public _treeData = [];

    @Input() public set treeData(tree) {
        this._treeData = tree;
    }
    @Input() clicked;
    @Input() first: string;
    @Input() actions = [];
    @Input() lists;

    @Output() actionClick = new EventEmitter();
    @Output() clickEvent = new EventEmitter();

    constructor(public dataExchangeService: DataExchangeService) {
    }

    click(e, i) {
        e.index = i;
        this.actionClick.emit(e);
    }

    ngOnInit() {

    }

    onClick(item, i) {
        this.dataExchangeService.pushData({
            order: item, lists: this.lists
        }, ["DETAIL"]);
        this.clickEvent.emit(item);
    }

    onClickChild(item) {
        this.clickEvent.emit(item);
    }
}
