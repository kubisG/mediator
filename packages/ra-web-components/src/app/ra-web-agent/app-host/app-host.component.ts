import { Component } from "@angular/core";
import { Dockable } from "../../dockable/decorators/dockable.decorators";

@Dockable({
    label: "App Host",
    params: {}
})
@Component({
    selector: "ra-app-host",
    templateUrl: "./app-host.component.html",
    styleUrls: ["./app-host.component.less"],
})
export class AppHostComponent {

}
