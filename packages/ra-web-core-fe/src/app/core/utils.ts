export function parseJsonMessage(result: any) {
    for (let i = 0; i < result.length; i++) {
        if (result[i].JsonMessage) {
            const jsonMessage = JSON.parse(result[i].JsonMessage);
            for (const messid in jsonMessage) {
                if (messid) {
                    if ((messid) && (!result[i][messid]) && (jsonMessage[messid])) {
                        result[i][messid] = jsonMessage[messid];
                    }
                }
            }
            result[i].JsonMessage = null;
        }
    }
}
