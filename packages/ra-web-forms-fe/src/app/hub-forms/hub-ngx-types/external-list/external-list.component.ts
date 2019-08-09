import { Component, OnInit } from "@angular/core";
import { FieldType } from "@ngx-formly/core";
import { RestFormsExternalService } from "../../../rest/forms-rest-external.service";
import { RestFormsSpecService } from "../../../rest/forms-rest-spec.service";

@Component({
  selector: "ra-formly-external-section",
  templateUrl: "./external-list.component.html",
  styleUrls: ["./external-list.component.less"],
})
export class ExternalListComponent extends FieldType implements OnInit {

  public lists: any[];


  constructor(private restFormsExternalService: RestFormsExternalService,
              private restFormsSpecService: RestFormsSpecService) {
    super();
  }

  ngOnInit() {
    if (this.field.templateOptions.externalList.url) {
        this.restFormsExternalService.getAllData(this.field.templateOptions.externalList.url).then(
          (data) => { this.lists = data ? data : []; });
    } else if (this.field.templateOptions.externalList.tableName) {
        if (this.field.templateOptions.externalList.tableName) {
          this.restFormsSpecService.getAllData().then(
            (data) => { this.lists = data ? data : []; });
        }
    }
  }

  compareFn = (c1: any, c2: any) => {
    return c1 && c2 ?
    c1[this.field.templateOptions.externalList.valueExpr] === c2[this.field.templateOptions.externalList.valueExpr] : c1 === c2;
  }

}
