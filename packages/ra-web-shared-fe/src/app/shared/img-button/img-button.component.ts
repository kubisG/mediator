import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from "@angular/core";

@Component({
    selector: "ra-img-button",
    templateUrl: "./img-button.component.html",
    styleUrls: ["./img-button.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImgButtonComponent implements OnInit {

    @Input() data;
    @Input() action = {
        label: "",
        visible: (data) => false,
        color: (data) => false,
        display: (data) => false,
        icon: "",
    };

    @Output() buttonClick: EventEmitter<any> = new EventEmitter();

    constructor() { }

    public click(e) {
        this.buttonClick.emit({ action: this.action, data: this.data });
    }

    public ngOnInit(): void {

    }

}
