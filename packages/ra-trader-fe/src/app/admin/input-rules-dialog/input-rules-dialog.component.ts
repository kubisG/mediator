import { OnInit, Inject, Component } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { InputRulesAdminService } from "../input-rules/input-rules-admin.service";
import { RestPreferencesService } from "../../rest/rest-preferences.service";
import { RestCompaniesService } from "../../rest/rest-companies.service";

/**
 * TODO : flags to enum (eg. N, N1)
 */
@Component({
    selector: "ra-dialog-input-rules",
    templateUrl: "input-rules-dialog.component.html",
    styleUrls: ["input-rules-dialog.component.less"]
})
export class InputRulesDialogComponent implements OnInit {

    public tree: { item: any, childs: any[], state: string }[] = [];
    private del = [];
    public allTypes: any[] = [];
    companies: any[] = [];
    public company = 0;
    public chooseExisting = false;
    public lists;

    public existingVal = { id: -1 };

    constructor(
        public dialogRef: MatDialogRef<InputRulesDialogComponent>,
        private companiesService: RestCompaniesService,
        private inputRulesService: InputRulesAdminService,
        private preferencesService: RestPreferencesService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.lists = data.rules;
        console.log(this.lists);
        console.log(data.items);
    }

    addChild(rule) {
        const label = rule.childs.length > 0 ? rule.childs[0].item.label : "";
        rule.childs.push({
            item: {
                id: -1,
                relid: -1,
                parentId: rule.item.relid,
                rootId: (rule.item.rootId === null ? rule.item.relid : rule.item.rootId),
                label: label,
                value: "",
                name: ""
            },
            childs: [],
            state: (label === "" ? "N" : "N1"),
        });
    }

    editItem(rule) {
        rule.state = "N1";
        this.existingVal.id = rule.item.id;
    }

    deleteItem(rule) {
        this.inputRulesService.deleteItemFromTree(rule, this.tree);
        if (rule.state === "S") {
            this.del.push(rule.item);
        }
    }

    saveItem(rule) {
        console.log(rule);
        rule.state = "S";
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onOkClick() {
        this.dialogRef.close({ companyId: this.company, inputs: this.tree, del: this.del });
    }

    ngOnInit(): void {
        this.companiesService.getCompanies().then(
            (data) => {
                this.companies = data[0].sort((a, b) => a.companyName.localeCompare(b.companyName));
            })
            .catch((error) => {
                this.companies = [];
            });
        this.preferencesService.getAppPref("order_store_lists").then((columns) => {
            this.allTypes = columns.sort((a, b) => a.localeCompare(b));
        });
        if (this.data.items.length === 1 && this.data.items[0].state === "N") {
            delete this.data.items[0].state;
            this.tree.push({ item: this.data.items[0], childs: [], state: "N" });
            return;
        }
        this.tree = this.inputRulesService.createTree(this.data.items, this.tree, null);
    }

    changeVal(evt, rule) {
        rule.item.id = evt.value.id;
        rule.item.name = evt.value.name;
        rule.item.value = evt.value.value;
        console.log(rule);
    }

    compareObjects(o1: any, o2: any): boolean {
        return o1.id === o2.id;
    }

}
