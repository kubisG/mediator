import { Component, ChangeDetectionStrategy, Input } from "@angular/core";

@Component({
    selector: "ra-balance-info",
    templateUrl: "./balance-info.component.html",
    styleUrls: ["./balance-info.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceInfoComponent {
    @Input() balance;
    @Input() currency;
}
