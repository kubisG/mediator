import { Directive, HostListener, ElementRef, Input } from "@angular/core";

@Directive({
  selector: "[raPressKey]"
})
export class RaPressKDirective {

  @Input("raPressKey") raPressKey;


  @HostListener("keydown", ["$event"]) onKeyDown(evt) {
    if (evt.key === "k") {
      if (this.raPressKey.controls[evt.target.name] && this.raPressKey.controls[evt.target.name].value < 9999999) {
        const val = (this.raPressKey.controls[evt.target.name].value * 1000);
        this.raPressKey.controls[evt.target.name].setValue(val);
      }
    }
  }
}
