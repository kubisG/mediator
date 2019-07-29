import { formatDate } from "@angular/common";

export function parseJsonMessage(result, field = "JsonMessage", prefix = "") {

    if (Array.isArray(result)) {
        for (let i = 0; i < result.length; i++) {
            if (result[i][field]) {
                let jsonMessage = null;
                if (typeof result[i][field] === "object") {
                    jsonMessage = result[i][field];
                } else {
                    jsonMessage = JSON.parse(result[i][field]);
                }
                for (const messid in jsonMessage) {
                    if (messid) {
                        if ((messid) && (!result[i][prefix + messid]) && (jsonMessage[messid])) {
                            result[i][prefix + messid] = jsonMessage[messid];
                        }
                    }
                }
                delete result[i][field];
            }
        }
    } else {
        if (result[field]) {
            let jsonMessage = null;
            if (typeof result[field] === "object") {
                jsonMessage = result[field];
            } else {
                jsonMessage = JSON.parse(result[field]);
            }
            for (const messid in jsonMessage) {
                if (messid) {
                    if ((messid) && (!result[prefix + messid]) && (jsonMessage[messid])) {
                        result[prefix + messid] = jsonMessage[messid];
                    }
                }
            }
            delete result[field];
        }
    }
}


export function extractValues(mappings, disaplyName) {
    if (!mappings) {
        return;
    }
    return mappings.map(a => a[disaplyName]);
}


export function hitlistFormatValue(values, columnDef) {
    const data = values.data ? values.data : values;
    const dtField = columnDef.dataField;
    if (!data[dtField] || data[dtField] === null) {
        if (columnDef.dataType === "number") {
            return Number("0").toLocaleString(undefined, {maximumFractionDigits: values.column.userProvidedColDef.format
                ? values.column.userProvidedColDef.format.precision : (columnDef.format ? columnDef.format.precision : null)});
        }
        if (columnDef.dataType === "bool") {
            return "No";
        }
        return;
    }
    switch (columnDef.dataType) {
        case "number": {
            if (values.data) {
                return Number(data[dtField]).toLocaleString(undefined, {maximumFractionDigits:values.column.userProvidedColDef.format
                    ? values.column.userProvidedColDef.format.precision : (columnDef.format ? columnDef.format.precision : null)});
            } else {
                return Number(data[dtField]);
            }
        }
        case "date": {
            if (values.data) {
                return formatDate(data[dtField],
                    values.column.userProvidedColDef.format ? values.column.userProvidedColDef.format : columnDef.format, 
                    columnDef.locale ? columnDef.locale : this.locale);
            } else {
                return new Date(data[dtField]);
            }
        }
        case "bool": {
            return data[dtField] ? "Yes" : "No";
        }
        case "lookup": {
            if ((columnDef.lookup) && (columnDef.lookup.dataSource)) {
                const obj = columnDef.lookup.dataSource.find(o => o[columnDef.lookup["valueExpr"]] === data[dtField]);
                if (obj) {
                    return obj[columnDef.lookup.displayExpr];
                }
            }
            return data[dtField];
        }
        default: {
            return data[dtField];
        }
    }
}
