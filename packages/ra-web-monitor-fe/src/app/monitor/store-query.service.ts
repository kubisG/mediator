import { Injectable } from "@angular/core";
import { QueryBuilderService, Operator } from "@ra/web-components";

@Injectable()
export class StoreQueryService {

    private prefix = "";
    private query = "*";
    // private query = "SenderCompID=(WOOD|DETR2)";

    constructor(
        private queryBuilderService: QueryBuilderService,
    ) { }

    public setPrefix(prefix: string) {
        if (!prefix) {
            return;
        }
        const splitedPrefix = prefix.split(".");
        this.prefix = splitedPrefix[0];
        if (splitedPrefix.length > 1) {
            splitedPrefix.shift();
            this.query = splitedPrefix.join(".");
        }
    }

    public getQuery() {
        return `${this.prefix}.${this.query}`;
    }

    public createQuery(operator: Operator) {
        this.query = this.queryBuilderService.build(operator);
    }

}
