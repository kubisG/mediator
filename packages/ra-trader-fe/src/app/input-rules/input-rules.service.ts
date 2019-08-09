import { Injectable } from "@angular/core";
import { InputRules } from "./input-rules";

@Injectable({
    providedIn: "root",
})
export class InputRulesService {

    create(): InputRules {
        return new InputRules();
    }

}
