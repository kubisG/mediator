import { Injectable, LOCALE_ID, Inject } from "@angular/core";
import { RestFormsService } from "../rest/forms-rest.service";
import { RestFormsExternalService } from "../rest/forms-rest-external.service";
import { hitlistFormatValue } from "@ra/web-shared-fe";
@Injectable()
export class HubFormsService {

    public hitlistFormat = hitlistFormatValue;

    constructor(public restFormsService: RestFormsService,
        @Inject(LOCALE_ID) private locale: string,
        public restFormsExternalService: RestFormsExternalService) { }


    getType(type) {
        switch (type) {
            case "datepicker": {
                return "date";
            }
            default: {
                return type;
            }
        }
    }

    public processFields(fields, columns) {
        const that = this;
        for (let i = 0; i < fields.length; i++) {
            if (fields[i].fieldGroup) {
                this.processFields(fields[i].fieldGroup, columns);
            } else {
                if (fields[i].type && fields[i].type === "externalList") {
                    if (fields[i].templateOptions.multiple) {
                        columns.push({
                            dataField: fields[i].key, showInColumnChooser: false,
                            caption: (fields[i].caption ? fields[i].caption :
                                (fields[i].templateOptions ? fields[i].templateOptions.label : undefined)),
                            valueGetter: function (data) {
                                return that.formatValue(data, fields[i].key);
                            },
                            valueFormatter: function (data) {
                                return that.showMultipleObject(data, fields[i].templateOptions.externalList.displayExpr);
                            }
                        });
                    } else {
                        columns.push({
                            dataField: fields[i].key, showInColumnChooser: false,
                            caption: (fields[i].caption ? fields[i].caption :
                                (fields[i].templateOptions ? fields[i].templateOptions.label : undefined)),
                            valueGetter: function (data) {
                                return that.formatValue(data, fields[i].key);
                            },
                            valueFormatter: function (data) {
                                return that.showObject(data, fields[i].templateOptions.externalList.displayExpr);
                            }
                        });
                    }
                } else if (fields[i].type && fields[i].type !== "repeat") {
                    if ((fields[i].templateOptions) && (fields[i].templateOptions.options)) {
                        const source = fields[i].templateOptions.options;
                        if (fields[i].templateOptions.multiple) {
                            columns.push({
                                dataField: fields[i].key, showInColumnChooser: false,
                                caption: (fields[i].caption ? fields[i].caption :
                                    (fields[i].templateOptions ? fields[i].templateOptions.label : undefined)),
                                lookup: { dataSource: source, displayExpr: "label", valueExpr: "value" },
                                valueFormatter: function (data) {
                                    return that.showMultiple(data, fields[i].key);
                                }
                            });
                        } else {
                            columns.push({
                                dataField: fields[i].key, showInColumnChooser: false,
                                caption: (fields[i].caption ? fields[i].caption :
                                    (fields[i].templateOptions ? fields[i].templateOptions.label : undefined)),
                                lookup: { dataSource: source, displayExpr: "label", valueExpr: "value" }
                            });
                        }
                    } else {
                        if (fields[i].type === "datepicker") {
                            columns.push({
                                dataField: fields[i].key,
                                caption: (fields[i].caption ? fields[i].caption :
                                    (fields[i].templateOptions ? fields[i].templateOptions.label : undefined)),
                                showInColumnChooser: false, dataType: this.getType(fields[i].type)
                                , valueFormatter: (data) => {
                                    return that.hitlistFormat(data,
                                        { locale: that.locale, dataField: "createDate", dataType: "date", format: "y/MM/dd" }
                                    );
                                }
                            });

                        } else {
                            columns.push({
                                dataField: fields[i].key,
                                caption: (fields[i].caption ? fields[i].caption :
                                    (fields[i].templateOptions ? fields[i].templateOptions.label : undefined)),
                                showInColumnChooser: false, dataType: this.getType(fields[i].type)
                            });

                        }

                    }
                }
            }
        }
    }

    getColumns(key) {
        return this.getFields(key).then((fields) => {
            const columns = [];
            // const columns = [{ dataField: "name", caption: "Name", showInColumnChooser: false, dataType: "string" },
            // {
            //     dataField: "status", caption: "Status", showInColumnChooser: false,
            //     lookup: {
            //         dataSource: [{ label: "On", value: "on" }, { label: "Off", value: "off" }]
            //         , displayExpr: "label", valueExpr: "value"
            //     }
            // },
            // { dataField: "accounts", caption: "Accounts", showInColumnChooser: false, dataType: "string" },
            // { dataField: "alertMessage", caption: "Alert Message", showInColumnChooser: false, dataType: "string" },
            // {
            //     dataField: "emailAlerts", caption: "Email Alerts", showInColumnChooser: false,
            //     lookup: {
            //         dataSource: [{ label: "On", value: "on" }, { label: "Off", value: "off" }]
            //         , displayExpr: "label", valueExpr: "value"
            //     }
            // },
            // { dataField: "emailAddress", caption: "Email Adresses", showInColumnChooser: false, dataType: "string" },
            // { dataField: "updatedBy", caption: "Updated By", showInColumnChooser: false, dataType: "string" },
            // { dataField: "updatedDate", caption: "Updated", showInColumnChooser: false, dataType: "date" },
            // { dataField: "createdBy", caption: "Created By", showInColumnChooser: false, dataType: "string" },
            // { dataField: "createDate", caption: "Created", showInColumnChooser: false, dataType: "date" }];
            this.processFields(fields, columns);

            return columns;
        });
    }

    getFields(key) {
        return this.restFormsService.getSpecData(key);
    }

    showMultiple(data, key) {
        const list = data.value;
        let resp = " ";
        if ((list) && (list.length > 0)) {
            resp = "";
            for (const item of list) {
                if (resp !== "") { resp += ", "; }
                resp += item;
            }
        }
        return resp ? resp : data.value;
    }

    showMultipleObject(data, key) {
        const list = data.value && data.value[key] ? data.value[key] : data.value;
        let resp = "";
        if ((list) && (list.length > 0)) {
            for (const item of list) {
                if (resp !== "") { resp += ", "; }
                resp += item[key];
            }
        }
        return resp ? resp : data.value;
    }

    showObject(data, key) {
        return data.value ? data.value[key] : data.value;
    }

    formatValue(data, key) {
        try {
            if ((data.data) && (typeof data.data[key] === "string" || data.data[key] instanceof String)) {
                data.data[key] = JSON.parse(data.data[key]);
            }
            return data.data ? data.data[key] : null;
        } catch (ex) {
            return data.data ? data.data[key] : null;
        }
    }

}
