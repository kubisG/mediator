import { Injectable, ElementRef } from "@angular/core";
import { Store } from "@ngxs/store";

@Injectable()
export class AppHostService {

    public frame: ElementRef;
    public frameElement: HTMLIFrameElement;
    public contentWindow: WindowProxy;

    constructor(
        private store: Store,
    ) { }

    private getWindow(): Window {
        return window;
    }

    private attchMessageListener() {
        this.getWindow().addEventListener("message", (ev: MessageEvent) => {
            console.log(ev);
        }, false);
    }

    public initFrameCommunication(frame: ElementRef) {
        this.attchMessageListener();
        this.frame = frame;
        this.frameElement = frame.nativeElement;
        this.contentWindow = frame.nativeElement.contentWindow;
        this.frameElement.onload = (event) => {
            this.contentWindow.postMessage({ test: "TEST" }, "*");
        };
    }

}
