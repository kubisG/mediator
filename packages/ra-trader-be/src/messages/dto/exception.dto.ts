import { WsResponse } from "@nestjs/websockets";

export class ExceptionDto implements WsResponse {

    public event: string = "exception";

    constructor(
        public data: any,
    ) { }
}
