import { Component, OnInit, ComponentFactoryResolver, Injector, ApplicationRef } from "@angular/core";
import { DockableComponent } from "../dockable/dockable.component";
import { Dockable } from "../dockable/decorators/dockable.decorators";
import { Observable } from "rxjs/internal/Observable";
import { NotifyItem } from "./notify-item.interface";
import { NotifyListService } from "./notify-list.service";

@Dockable({
    label: "Notifications",
    icon: "list_alt",
    single: false
})
@Component({
    selector: "ra-notify",
    templateUrl: "./notify.component.html",
    styleUrls: ["./notify.component.less"]
})
export class NotifyComponent extends DockableComponent implements OnInit {

    public notifyItems: Observable<NotifyItem[]>;

    constructor(
        private notifyService: NotifyListService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
    }


    ngOnInit(): void {
        this.notifyItems = this.notifyService.notifyItems$;
    }

}
