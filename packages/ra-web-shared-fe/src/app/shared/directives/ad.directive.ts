import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector: "[raAdHost]",
})
export class AdDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}
