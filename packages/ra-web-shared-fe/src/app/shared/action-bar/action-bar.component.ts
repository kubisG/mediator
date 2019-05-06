import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";
import { ActionItem } from "./action-item";

@Component({
    selector: "ra-action-bar",
    templateUrl: "./action-bar.component.html",
    styleUrls: ["./action-bar.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionBarComponent {

    @Input() items: ActionItem[];

    @Output() itemClick: EventEmitter<ActionItem> = new EventEmitter<ActionItem>();

}
