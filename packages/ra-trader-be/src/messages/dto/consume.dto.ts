import { WsResponse } from "@nestjs/websockets";

export class ConsumeDto implements WsResponse {

    public event: string = "consume";

    constructor(
        public data: any,
    ) { }
}
