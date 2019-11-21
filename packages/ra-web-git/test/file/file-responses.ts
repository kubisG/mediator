
// TODO: response objects goes here
// just copy & paste json object and do the following
export const GET_FILE_ERROR_RESPONSE = JSON.parse(JSON.stringify(`{
    "statusCode": 404,
    "error": "Not Found",
    "message": "Cannot GET /api/v1/files/goisj/monitor/test/s"
}`));

export const GET_FILE_SUCCESS_RESPONSE = JSON.parse(JSON.stringify(`[
    {
        "name": ".angular-config.json",
        "path": "C:\\Users\\goisj\\monitor\\test\\.angular-config.json",
        "directory": false
    },
    {
        "name": "test1",
        "path": "C:\\Users\\goisj\\monitor\\test\\test1",
        "directory": true
    }
]`));