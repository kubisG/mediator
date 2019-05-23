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
