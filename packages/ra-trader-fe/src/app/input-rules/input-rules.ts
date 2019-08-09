import { ReplaySubject } from "rxjs/internal/ReplaySubject";
import { Observable } from "rxjs/internal/Observable";

export class InputRules {
    private rules = { childs: {} };

    public inputModel = {};

    private newRule: ReplaySubject<any> = new ReplaySubject(1);
    public newRule$: Observable<any> = this.newRule.asObservable();

    constructor() { }

    public addAllRules(rules: any) {
        this.rules.childs = rules;
        this.newRule.next();
    }

    public isInitialized() {
        return Object.keys(this.rules.childs).length > 0;
    }

    private getRules(...selector: any[]) {
        let buff = this.rules;
        for (let i = 0; i < selector.length; i++) {
            if (selector[i] instanceof Array) {
                const childs = buff.childs[selector[i][0]];
                if (!childs) {
                    return [];
                }
                for (let j = 0; j < childs.length; j++) {
                    if (childs[j].value === selector[i][1]) {
                        buff = childs[j];
                    }
                }
            } else {
                buff = buff.childs[selector[i]];
            }
        }
        return buff;
    }

    getCollection(...selector: any[]) {
        const result = this.getRules(...selector);
        if (result instanceof Array) {
            return result;
        }
        return [];
    }

    getCollectionArray(selector: any[]) {
        return this.getCollection(...selector);
    }

    getObject(...selector: any[]) {
        const result = this.getRules(...selector);
        if (result instanceof Array) {
            return {};
        }
        return result;
    }
}
