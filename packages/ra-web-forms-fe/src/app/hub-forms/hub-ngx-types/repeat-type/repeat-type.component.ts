import { Component, OnInit } from "@angular/core";
import { FieldArrayType } from "@ngx-formly/core";

@Component({
  selector: "ra-formly-repeat-section",
  templateUrl: "./repeat-type.component.html",
  styleUrls: ["./repeat-type.component.less"],
})
export class RepeatTypeComponent extends FieldArrayType implements OnInit {

  ngOnInit() {
    if (this.model.length === 0) {
      this.add();
    }
  }

}
