import { Input, Component, Output, EventEmitter } from "@angular/core";
import { OrderStatusService } from "../order-status.service";


@Component({
    selector: "ra-row-actions",
    templateUrl: "./row-actions.component.html",
    styleUrls: ["./row-actions.component.less"],
})
export class RowActionsComponent {

    @Input() data;
    @Input() actions = [];

    @Output() accept: EventEmitter<any> = new EventEmitter();
    @Output() reject: EventEmitter<any> = new EventEmitter();
    @Output() buttonClick: EventEmitter<any> = new EventEmitter();

    constructor(
        private orderStatusService: OrderStatusService,
    ) {
    }

    public click(action) {
        this.buttonClick.emit({ action, data: this.data });
    }

    public rejectClick() {
        this.reject.emit(this.data);
    }

    public acceptClick() {
        this.accept.emit(this.data);
    }

    public canAccept() {
        return this.orderStatusService.canAccept(this.data.data);
    }

    public canReject() {
        return this.orderStatusService.canReject(this.data.data);
    }

}
