import { Component, Input, forwardRef, OnInit, OnDestroy, ChangeDetectionStrategy, EventEmitter, Output } from "@angular/core";
import { InputRules } from "../input-rules";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from "@angular/forms";
import { Subscription } from "rxjs/internal/Subscription";

@Component({
    selector: "ra-input-rule-select",
    templateUrl: "./input-rule-select.component.html",
    styleUrls: ["./input-rule-select.component.less"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputRuleSelectComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputRuleSelectComponent implements ControlValueAccessor, OnInit, OnDestroy {

    @Input() placeholder: any;
    @Input() emptyValue = false;
    @Input() multiple: boolean;
    @Input() required: boolean;
    @Input() inputRules: InputRules;
    @Input() enabledValues: any;
    @Input() showAll: boolean;

    public _selector;

    @Input() set selector(sel) {
        let items = this.inputRules.getCollection(...sel);
        if (this.enabledValues) {
            items = items.filter(coll => this.enabledValues.includes(coll.value));
        }
        if (items.length > 0) {
            if (this.multiple) {
                this.formControl.setValue([this.emptyValue ? "" : items[0].value]);
            } else {
                this.formControl.setValue(this.emptyValue ? "" : items[0].value);
            }
            this.items = items;
        } else {


            if (this.showAll) {
                this.items = this.inputRules.getCollection(...sel.slice(-1));
            } else {
                if (this.multiple) {
                    this.formControl.setValue([""]);
                } else {
                    this.formControl.setValue("");
                }
                this.items = [];
            }
        }
        this._selector = sel;
    }

    @Input() set disabledInput(disabled: boolean) {
        if (disabled) {
            this.formControl.disable();
        } else {
            this.formControl.enable();
        }
    }

    @Input() set valueInput(val: any) {
        this.writeValue(val);
    }

    public items = [];
    public isDisabled = false;

    public selected: any;

    private onChange: Function;
    public onTouched: Function;

    formControl = new FormControl("");
    subscription: Subscription;
    newRuleSub: Subscription;

    ngOnInit() {
        const that = this;
        this.subscription = this.formControl.valueChanges
            .subscribe((v) => {
                if (this.onChange) {
                    this.onChange(v);
                }
            });
        this.newRuleSub = this.inputRules.newRule$.subscribe(() => {
            let items = this.inputRules.getCollection(...this._selector);
            if (this.enabledValues) {
                items = items.filter(coll => this.enabledValues.includes(coll.value));
            }

            if (items.length > 0) {
                if (this.multiple) {
                    this.formControl.setValue([this.emptyValue ? "" : items[0].value]);
                } else {
                    this.formControl.setValue(this.emptyValue ? "" : items[0].value);
                }
                // if (items.length === 1) {
                //     that.formControl.disable();
                // }
                this.items = items;
            } else {
                if (this.showAll) {
                    this.items = this.inputRules.getCollection(...this._selector.slice(-1));
                } else {
                    if (this.multiple) {
                        this.formControl.setValue([""]);
                    } else {
                        this.formControl.setValue("");
                    }
                    this.items = [];
                }
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.newRuleSub.unsubscribe();
    }

    writeValue(val) {
        if (this.multiple) {
            this.formControl.setValue([val], { emitEvent: false });
        } else {
            this.formControl.setValue(val, { emitEvent: false });
        }
    }

    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }
}
