import { Input, Output, EventEmitter } from "@angular/core";

export interface OperatorComponent<T> {

    column: string;
    output: EventEmitter<T>;

}
